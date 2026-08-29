"use server";

import { createClient } from "@/lib/supabase/server";
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
 * Submit Physical Card Request with Photo Upload and Payment Receipt Reference
 */
export async function submitPhysicalCardRequestAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "عذراً، يجب تسجيل الدخول لطلب بطاقة عضوية مادية." };
    }

    const supabaseAdmin = createAdminClient();

    // Verify active membership
    const { data: member } = await supabaseAdmin
      .from("members")
      .select("id, status")
      .eq("user_id", user.id)
      .single();

    if (!member || member.status !== "active") {
      return { success: false, error: "طلب البطاقة المادية متاح فقط للأعضاء أصحاب العضويات النشطة والمفعلة." };
    }

    const photoFile = formData.get("photoFile") as File;
    const transactionRef = (formData.get("transactionRef") as string || "").trim();
    const feeStr = formData.get("feeSdg") as string || "50000";
    const feeSdg = parseFloat(feeStr);

    if (!photoFile || photoFile.size === 0) {
      return { success: false, error: "يرجى رفع صورة شخصية حديثة وواضحة لاستخراج البطاقة." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photoFile.type)) {
      return { success: false, error: "صيغة الصورة غير مدعومة. يرجى رفع صورة بصيغة JPG أو PNG أو WEBP." };
    }

    if (photoFile.size > 5 * 1024 * 1024) {
      return { success: false, error: "حجم الصورة الشخصية يتجاوز الحد المسموح به (5 ميجابايت)." };
    }

    // 1. Upload Photo
    const photoExt = photoFile.name.split(".").pop() || "jpg";
    const photoName = `cards/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${photoExt}`;
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());

    const { error: photoErr } = await supabaseAdmin.storage
      .from("payment-receipts")
      .upload(photoName, photoBuffer, {
        contentType: photoFile.type,
        upsert: false,
      });

    if (photoErr) {
      console.error("Card Photo Upload Error:", photoErr);
    }

    // 2. Insert Payment Receipt for physical card fee if transactionRef provided
    let receiptId: string | null = null;
    if (transactionRef) {
      const { data: receipt } = await supabaseAdmin
        .from("payment_receipts")
        .insert({
          user_id: user.id,
          member_id: member.id,
          amount: feeSdg,
          payment_type: "physical_card_fee",
          transaction_reference: transactionRef,
          receipt_path: photoName,
          status: "pending_review",
          notes: "رسوم استخراج بطاقة عضوية مادية",
        })
        .select("id")
        .single();

      if (receipt) receiptId = receipt.id;
    }

    // 3. Insert Physical Card Request
    const { data: cardReq, error: insertError } = await supabaseAdmin
      .from("physical_card_requests")
      .insert({
        user_id: user.id,
        member_id: member.id,
        photo_url: photoName,
        fee_sdg: feeSdg,
        payment_receipt_id: receiptId,
        status: "pending_review",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Physical Card Insert Error:", insertError);
      return { success: false, error: "حدث خطأ أثناء تقديم طلب البطاقة المادية." };
    }

    revalidatePath("/profile");
    revalidatePath("/admin");

    return {
      success: true,
      message: "تم إرسال طلب استخراج بطاقة العضوية المادية بنجاح، وطلبك قيد المراجعة والمعالجة الآن.",
      data: cardReq,
    };
  } catch (err) {
    console.error("Physical Card Action Error:", err);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

/**
 * Get User's Physical Card Requests & Receipts History
 */
export async function getMemberCardAndReceiptsHistoryAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { cardRequests: [], receipts: [], subscriptions: [] };

    const supabaseAdmin = createAdminClient();

    const { data: cardRequests } = await supabaseAdmin
      .from("physical_card_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: receipts } = await supabaseAdmin
      .from("payment_receipts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: member } = await supabaseAdmin
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .single();

    let subscriptions: any[] = [];
    if (member) {
      const { data: subs } = await supabaseAdmin
        .from("membership_subscriptions")
        .select(`
          *,
          membership_plans (
            name_ar,
            price_sdg
          )
        `)
        .eq("member_id", member.id)
        .order("created_at", { ascending: false });
      subscriptions = subs || [];
    }

    return {
      cardRequests: cardRequests || [],
      receipts: receipts || [],
      subscriptions,
    };
  } catch {
    return { cardRequests: [], receipts: [], subscriptions: [] };
  }
}

/**
 * Get Admin Physical Card Requests (Admin Only)
 */
export async function getAdminPhysicalCardRequestsAction() {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) return [];

    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("physical_card_requests")
      .select(`
        *,
        members (
          full_name,
          membership_number,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

/**
 * Admin Review & Update Status for Physical Card Request
 */
export async function reviewPhysicalCardRequestAction(
  requestId: string,
  newStatus: string,
  rejectionReason: string = "",
  deliveryNotes: string = ""
): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بإدارة طلبات البطاقات المادية." };
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from("physical_card_requests")
      .update({
        status: newStatus,
        rejection_reason: rejectionReason || null,
        delivery_notes: deliveryNotes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    if (error) {
      return { success: false, error: "حدث خطأ أثناء تحديث حالة طلب البطاقة." };
    }

    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true, message: "تم تحديث حالة طلب البطاقة المادية بنجاح." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء إجراء المراجعة." };
  }
}
