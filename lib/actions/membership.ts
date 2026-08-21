"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function registerMemberAction(formData: FormData) {
  try {
    // Require authenticated user session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "عذراً، يجب تسجيل الدخول لتقديم طلب العضوية الرسمية." };
    }

    const supabaseAdmin = createAdminClient();

    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string || "";
    const nationalId = formData.get("nationalId") as string || "";
    const state = formData.get("state") as string;
    const locality = formData.get("locality") as string;
    const city = formData.get("city") as string || "";
    const occupation = formData.get("occupation") as string || "";
    const education = formData.get("education") as string || "";
    const planId = formData.get("planId") as string;

    if (!fullName || !phone || !state || !locality || !planId) {
      return { success: false, error: "يرجى ملء جميع الحقول المطلوبة (الاسم الكامل، الهاتف، الولاية، المحلية، ومستوى العضوية)." };
    }

    // Insert new member record linked to user.id
    const { data: member, error } = await supabaseAdmin
      .from("members")
      .insert({
        user_id: user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        national_id: nationalId.trim(),
        state,
        locality,
        city,
        occupation,
        education,
        plan_id: planId,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Register Member Error:", error);
      return { success: false, error: "حدث خطأ أثناء إرسال طلب العضوية. يرجى التثبت من البيانات والمحاولة مجدداً." };
    }

    revalidatePath("/admin");
    return {
      success: true,
      message: "تم تسجيل طلب العضوية بنجاح! يمكنك الآن إكمال عملية دفع الاشتراك ورفع الإشعار لتفعيل العضوية.",
      data: member,
    };
  } catch (err) {
    console.error("Register Member Action Error:", err);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

export async function getMemberByNumberAction(membershipNumber: string) {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: member, error } = await supabaseAdmin
      .from("members")
      .select(`
        membership_number,
        full_name,
        state,
        locality,
        status,
        created_at,
        membership_plans (
          name_ar
        )
      `)
      .eq("membership_number", membershipNumber.trim())
      .single();

    if (error || !member) {
      return null;
    }

    return member;
  } catch {
    return null;
  }
}
