"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function submitSocialRequestAction(formData: FormData) {
  try {
    const supabaseAdmin = createAdminClient();

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const details = formData.get("details") as string;
    const amountStr = formData.get("amount") as string;
    const amountRequested = parseFloat(amountStr);
    const userId = formData.get("userId") as string || null;

    if (!title || !category || !details || isNaN(amountRequested) || amountRequested <= 0) {
      return { success: false, error: "يرجى إدخال جميع التفاصيل المطلوبة والمبلغ المطلوب بشكل صحيح." };
    }

    const { data, error } = await supabaseAdmin
      .from("social_requests")
      .insert({
        user_id: userId,
        title: title.trim(),
        category,
        details: details.trim(),
        amount_requested: amountRequested,
        status: "submitted",
      })
      .select()
      .single();

    if (error) {
      console.error("Submit Social Request Error:", error);
      return { success: false, error: "حدث خطأ أثناء تقديم طلب التكافل." };
    }

    return { success: true, message: "تم تسجيل طلب الدعم الاجتماعي بنجاح، وسيتم مراجعته بواسطة الدائرة الاجتماعية.", data };
  } catch (err) {
    console.error("Social Request Action Error:", err);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}
