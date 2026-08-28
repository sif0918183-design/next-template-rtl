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
 * Updates user profile details and calculates profile completion score (e.g. 40% to 100%).
 */
export async function updateProfileCompletionAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "يجب تسجيل الدخول لاستكمال بيانات ملفك التعريفي." };
    }

    const birthDate = formData.get("birthDate") as string || null;
    const birthPlace = formData.get("birthPlace") as string || "";
    const countryResidence = formData.get("countryResidence") as string || "السودان";
    const qualification = formData.get("qualification") as string || "";
    const specialization = formData.get("specialization") as string || "";
    const profession = formData.get("profession") as string || "";
    const maritalStatus = formData.get("maritalStatus") as string || "";
    const familyMembersCount = parseInt(formData.get("familyMembersCount") as string || "1", 10);

    // Calculate Completion Score
    let completionPct = 40; // Default base for authenticated account with email/phone
    if (birthDate) completionPct += 10;
    if (birthPlace) completionPct += 10;
    if (qualification) completionPct += 10;
    if (profession) completionPct += 10;
    if (maritalStatus) completionPct += 10;
    if (countryResidence) completionPct += 10;
    if (completionPct > 100) completionPct = 100;

    const supabaseAdmin = createAdminClient();

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        birth_date: birthDate,
        birth_place: birthPlace,
        country_residence: countryResidence,
        qualification,
        specialization,
        profession,
        marital_status: maritalStatus,
        family_members_count: familyMembersCount,
        profile_completion_pct: completionPct,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Update Profile Error:", profileError);
      return { success: false, error: "حدث خطأ أثناء حفظ بيانات الملف الشخصي." };
    }

    revalidatePath("/profile");
    return {
      success: true,
      message: `تم تحديث ملفك الشخصي بنجاح! نسبة اكتمال الملف الحالية: ${completionPct}%`,
    };
  } catch (err) {
    console.error("Update Profile Catch Error:", err);
    return { success: false, error: "حدث خطأ غير متوقع." };
  }
}

/**
 * Fetch all active membership plans (dynamically from DB)
 */
export async function getMembershipPlansAction() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: plans } = await supabaseAdmin
      .from("membership_plans")
      .select("*")
      .order("price_sdg", { ascending: true });

    return plans || [];
  } catch {
    return [];
  }
}

/**
 * Update Membership Plan Price/Name (Admin Only)
 */
export async function updateMembershipPlanAction(
  planId: string,
  nameAr: string,
  priceSdg: number,
  isRecommended: boolean
): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بتحديث أسعار أو خطط العضوية." };
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin
      .from("membership_plans")
      .update({
        name_ar: nameAr,
        price_sdg: priceSdg,
        is_recommended: isRecommended,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId);

    if (error) {
      return { success: false, error: "حدث خطأ أثناء تحديث خطة العضوية." };
    }

    revalidatePath("/admin");
    revalidatePath("/membership/select");
    return { success: true, message: "تم تحديث مستوى العضوية والمبلغ المعتمد بنجاح." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء التحديث." };
  }
}

/**
 * Fetch Monthly Membership Goal & Current Progress
 */
export async function getMonthlyMembershipGoalAction() {
  try {
    const supabaseAdmin = createAdminClient();

    // Get current month goal
    const todayStr = new Date().toISOString().slice(0, 7) + "-01";
    const { data: goal } = await supabaseAdmin
      .from("membership_goals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get real current count of active members
    const { count: currentMembersCount } = await supabaseAdmin
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const targetMembersCount = goal ? goal.target_members_count : 1000;

    return {
      targetMembersCount,
      currentMembersCount: currentMembersCount || 0,
      percentage: Math.min(100, Math.round(((currentMembersCount || 0) / targetMembersCount) * 100)),
      description: goal?.description || "هدفنا هذا الشهر لمواصلة الدعم والتكافل الاجتماعي",
    };
  } catch {
    return {
      targetMembersCount: 1000,
      currentMembersCount: 0,
      percentage: 0,
      description: "هدفنا هذا الشهر",
    };
  }
}

/**
 * Set/Update Monthly Membership Goal (Admin Only)
 */
export async function setMonthlyMembershipGoalAction(
  targetCount: number,
  description: string
): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بتعيين هدف العضوية الشهرية." };
    }

    const supabaseAdmin = createAdminClient();
    const targetMonth = new Date().toISOString().slice(0, 7) + "-01";

    const { error } = await supabaseAdmin
      .from("membership_goals")
      .upsert({
        target_month: targetMonth,
        target_members_count: targetCount,
        description,
        is_active: true,
      }, { onConflict: "target_month" });

    if (error) {
      return { success: false, error: "حدث خطأ أثناء حفظ هدف العضوية الشهرية." };
    }

    revalidatePath("/admin");
    revalidatePath("/profile");
    return { success: true, message: "تم تحديث هدف العضوية الشهرية بنجاح." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء تعيين الهدف." };
  }
}

export async function registerMemberAction(formData: FormData) {
  try {
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
