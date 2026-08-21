"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  user?: any;
}

/**
 * Real Supabase Auth SignUp Action
 */
export async function signUpAction(formData: FormData): Promise<AuthResult> {
  try {
    const email = (formData.get("email") as string || "").trim();
    const password = (formData.get("password") as string || "").trim();
    const fullName = (formData.get("fullName") as string || "").trim();
    const phone = (formData.get("phone") as string || "").trim();
    const state = (formData.get("state") as string || "").trim();
    const locality = (formData.get("locality") as string || "").trim();

    if (!email || !password || !fullName || !phone) {
      return { success: false, error: "يرجى تعبئة جميع الحقول الأساسية (البريد الإلكتروني، كلمة المرور، الاسم الكامل، والهاتف)." };
    }

    if (password.length < 6) {
      return { success: false, error: "كلمة المرور يجب ألا تقل عن 6 أحرف." };
    }

    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          state,
          locality,
        },
      },
    });

    if (authError || !authData.user) {
      console.error("SignUp Error:", authError);
      return { success: false, error: authError?.message || "حدث خطأ أثناء إنشاء الحساب." };
    }

    const userId = authData.user.id;
    const supabaseAdmin = createAdminClient();

    // 1. Create Profile
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      full_name: fullName,
      phone,
      state,
      locality,
      updated_at: new Date().toISOString(),
    });

    // 2. Assign default 'member' role
    const { data: memberRole } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("code", "member")
      .single();

    if (memberRole) {
      await supabaseAdmin.from("user_roles").insert({
        user_id: userId,
        role_id: memberRole.id,
      });
    }

    revalidatePath("/");
    return {
      success: true,
      message: "تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول والاستفادة من كافة خدمات المنصة.",
      user: authData.user,
    };
  } catch (err) {
    console.error("signUpAction Catch Error:", err);
    return { success: false, error: "حدث خطأ غير متوقع أثناء تسجيل الحساب." };
  }
}

/**
 * Real Supabase Auth SignIn Action
 */
export async function signInAction(formData: FormData): Promise<AuthResult> {
  try {
    const email = (formData.get("email") as string || "").trim();
    const password = (formData.get("password") as string || "").trim();

    if (!email || !password) {
      return { success: false, error: "يرجى إدخال البريد الإلكتروني وكلمة المرور." };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false, error: "بيانات الدخول غير صحيحة. يرجى التأكد من البريد وكلمة المرور." };
    }

    revalidatePath("/");
    return {
      success: true,
      message: "تم تسجيل الدخول بنجاح.",
      user: data.user,
    };
  } catch (err) {
    console.error("signInAction Error:", err);
    return { success: false, error: "حدث خطأ أثناء تسجيل الدخول." };
  }
}

/**
 * Real Supabase Auth SignOut Action
 */
export async function signOutAction(): Promise<AuthResult> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/");
    return { success: true, message: "تم تسجيل الخروج بنجاح." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء تسجيل الخروج." };
  }
}

/**
 * Fetch Current Authenticated User Profile
 */
export async function getCurrentUserAction() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const supabaseAdmin = createAdminClient();
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const { data: member } = await supabaseAdmin
      .from("members")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: userRoles } = await supabaseAdmin
      .from("user_roles")
      .select("roles(code, name_ar)")
      .eq("user_id", user.id);

    const roles = userRoles?.map((r: any) => r.roles?.code) || [];

    return {
      user,
      profile,
      member,
      roles,
      isAdmin: roles.some((r: string) =>
        ["super_admin", "secretary_general", "finance_manager", "executive_council"].includes(r)
      ),
    };
  } catch {
    return null;
  }
}
