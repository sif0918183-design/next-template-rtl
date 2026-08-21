"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdminUser } from "@/lib/actions/admin";
import { revalidatePath } from "next/cache";

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Validates and submits a new payment receipt for membership or donation.
 * Uploads file to private storage bucket 'payment-receipts' and creates receipt record.
 */
export async function submitPaymentReceiptAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabaseAdmin = createAdminClient();

    const paymentType = formData.get("paymentType") as string; // 'membership' | 'donation'
    const amountStr = formData.get("amount") as string;
    const amount = parseFloat(amountStr);
    const paymentMethodId = formData.get("paymentMethodId") as string;
    const transactionRef = formData.get("transactionRef") as string;
    const notes = formData.get("notes") as string || "";
    const memberId = formData.get("memberId") as string || null;
    const userId = formData.get("userId") as string || null;
    const campaignId = formData.get("campaignId") as string || null;
    const file = formData.get("receiptFile") as File;

    if (!amount || amount <= 0) {
      return { success: false, error: "قيمة المبلغ الدفوع يجب أن تكون أكبر من الصفر." };
    }

    if (!transactionRef || transactionRef.trim().length < 3) {
      return { success: false, error: "يرجى إدخال رقم العملية / مرجع التحويل بشكل صحيح." };
    }

    if (!file || file.size === 0) {
      return { success: false, error: "يرجى إرفاق صورة إشعار التحويل." };
    }

    // File validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: "نوع الملف غير مدعوم. يرجى رفع صورة (JPG, PNG, WEBP) أو ملف PDF." };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "حجم الملف يتجاوز الحد المسموح به (10 ميجابايت)." };
    }

    // Check duplicate transaction reference
    const { data: existingRef } = await supabaseAdmin
      .from("payment_receipts")
      .select("id")
      .eq("transaction_reference", transactionRef.trim())
      .single();

    if (existingRef) {
      return { success: false, error: "رقم المعاملة / مرجع التحويل مسجل مسبقاً في النظام." };
    }

    // Upload to Supabase Storage 'payment-receipts'
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment-receipts")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage Upload Error:", uploadError);
    }

    // Insert Payment Receipt
    const { data: receipt, error: insertError } = await supabaseAdmin
      .from("payment_receipts")
      .insert({
        user_id: userId,
        member_id: memberId,
        payment_method_id: paymentMethodId || null,
        amount,
        payment_type: paymentType,
        transaction_reference: transactionRef.trim(),
        receipt_path: filePath,
        notes,
        status: "pending_review",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert Receipt Error:", insertError);
      return { success: false, error: "حدث خطأ أثناء حفظ بيانات الإيصال. يرجى المحاولة مرة أخرى." };
    }

    if (paymentType === "donation" && receipt) {
      await supabaseAdmin.from("donations").insert({
        receipt_id: receipt.id,
        campaign_id: campaignId || null,
        donor_user_id: userId,
        amount,
        status: "pending_review",
        donation_reference: `DON-${Date.now().toString().slice(-6)}`,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/profile");

    return {
      success: true,
      message: "تم رفع إيصال التحويل بنجاح، وطلبك قيد المراجعة المالية الآن.",
      data: receipt,
    };
  } catch (error) {
    console.error("Submit Payment Receipt Action Error:", error);
    return { success: false, error: "حدث خطأ أثناء معالجة الطلب." };
  }
}

/**
 * Server Action for Administrative Approval or Rejection of Payments.
 * Strictly protected by server-side authorization check.
 */
export async function reviewPaymentReceiptAction(
  receiptId: string,
  decision: "approve" | "reject",
  rejectionReason: string = ""
): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "عذراً، لا تمتلك الصلاحيات الإدارية المتميزة لإجراء هذا الاعتماد المالي." };
    }

    const reviewerUserId = authCheck.user?.id || null;
    const supabaseAdmin = createAdminClient();

    const { data: receipt, error: fetchError } = await supabaseAdmin
      .from("payment_receipts")
      .select("*")
      .eq("id", receiptId)
      .single();

    if (fetchError || !receipt) {
      return { success: false, error: "لم يتم العثور على إيصال الدفع المطلوب." };
    }

    if (receipt.status === "approved") {
      return { success: false, error: "هذا الإيصال تم اعتماده مسبقاً." };
    }

    const newStatus = decision === "approve" ? "approved" : "rejected";

    const { error: updateError } = await supabaseAdmin
      .from("payment_receipts")
      .update({
        status: newStatus,
        rejection_reason: decision === "reject" ? rejectionReason : null,
        reviewed_by: reviewerUserId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", receiptId);

    if (updateError) {
      return { success: false, error: "حدث خطأ أثناء تحديث حالة الإيصال." };
    }

    if (decision === "approve") {
      const refNumber = `TRX-${Date.now().toString().slice(-8)}`;
      await supabaseAdmin.from("financial_transactions").insert({
        receipt_id: receipt.id,
        transaction_type: "income",
        category: receipt.payment_type === "membership" ? "membership_fee" : "donation",
        amount: receipt.amount,
        reference_number: refNumber,
        description: `اعتماد إشعار تحويل رقم: ${receipt.transaction_reference}`,
        created_by: reviewerUserId,
      });

      if (receipt.payment_type === "membership" && receipt.member_id) {
        await supabaseAdmin
          .from("members")
          .update({ status: "active" })
          .eq("id", receipt.member_id);

        const { data: memberData } = await supabaseAdmin
          .from("members")
          .select("plan_id")
          .eq("id", receipt.member_id)
          .single();

        let planIdToUse = memberData?.plan_id;
        if (!planIdToUse) {
          const { data: defaultPlan } = await supabaseAdmin
            .from("membership_plans")
            .select("id")
            .eq("code", "basic")
            .single();
          planIdToUse = defaultPlan?.id;
        }

        if (planIdToUse) {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setFullYear(endDate.getFullYear() + 1);

          await supabaseAdmin.from("membership_subscriptions").insert({
            member_id: receipt.member_id,
            plan_id: planIdToUse,
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
            status: "active",
          });
        }
      }

      if (receipt.payment_type === "donation") {
        const { data: donation } = await supabaseAdmin
          .from("donations")
          .select("campaign_id, amount")
          .eq("receipt_id", receipt.id)
          .single();

        if (donation && donation.campaign_id) {
          const { data: campaign } = await supabaseAdmin
            .from("donation_campaigns")
            .select("current_amount")
            .eq("id", donation.campaign_id)
            .single();

          const currentTotal = campaign ? Number(campaign.current_amount || 0) : 0;
          const newTotal = currentTotal + Number(donation.amount);

          await supabaseAdmin
            .from("donation_campaigns")
            .update({ current_amount: newTotal, updated_at: new Date().toISOString() })
            .eq("id", donation.campaign_id);

          await supabaseAdmin
            .from("donations")
            .update({ status: "approved" })
            .eq("receipt_id", receipt.id);
        }
      }

      await supabaseAdmin.from("audit_logs").insert({
        user_id: reviewerUserId,
        action: "APPROVE_PAYMENT",
        entity_type: "payment_receipts",
        entity_id: receipt.id,
        before_state: { status: receipt.status },
        after_state: { status: "approved", amount: receipt.amount },
      });
    } else {
      await supabaseAdmin.from("audit_logs").insert({
        user_id: reviewerUserId,
        action: "REJECT_PAYMENT",
        entity_type: "payment_receipts",
        entity_id: receipt.id,
        before_state: { status: receipt.status },
        after_state: { status: "rejected", reason: rejectionReason },
      });
    }

    revalidatePath("/admin");
    return { success: true, message: decision === "approve" ? "تم اعتماد التحويل وتحديث السجلات بنجاح." : "تم رفض الإيصال وتحديث السبب." };
  } catch (error) {
    console.error("Review Payment Receipt Error:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء معالجة القرار." };
  }
}

/**
 * Get signed URL for previewing receipt in admin dashboard securely.
 */
export async function getReceiptSignedUrlAction(filePath: string): Promise<string | null> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return null;
    }

    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin.storage
      .from("payment-receipts")
      .createSignedUrl(filePath, 3600);

    if (error || !data) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
