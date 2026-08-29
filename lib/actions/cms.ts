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

// --------------------------------------------------------------------
// NEWS & OFFICIAL STATEMENTS CMS
// --------------------------------------------------------------------
export async function getNewsAction() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("news")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

export async function saveNewsAction(formData: FormData): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بإجراء التعديلات الإعلامية." };
    }

    const supabaseAdmin = createAdminClient();
    const id = formData.get("id") as string || null;
    const title = (formData.get("title") as string || "").trim();
    const excerpt = (formData.get("excerpt") as string || "").trim();
    const content = (formData.get("content") as string || "").trim();
    const category = (formData.get("category") as string || "عام").trim();
    const featuredImage = (formData.get("featuredImage") as string || "").trim();

    if (!title || !content) {
      return { success: false, error: "يرجى كتابة عنوان الخبر ونصه كاملاً." };
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") || `news-${Date.now()}`;

    if (id) {
      await supabaseAdmin.from("news").update({
        title,
        excerpt,
        content,
        category,
        featured_image: featuredImage || null,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
    } else {
      await supabaseAdmin.from("news").insert({
        title,
        slug,
        excerpt,
        content,
        category,
        featured_image: featuredImage || null,
        status: "published",
        author_id: authCheck.user?.id || null,
      });
    }

    revalidatePath("/");
    revalidatePath("/media");
    return { success: true, message: "تم حفظ الخبر بنجاح ونشره على المنصة." };
  } catch (err) {
    console.error("Save News Error:", err);
    return { success: false, error: "حدث خطأ أثناء حفظ الخبر." };
  }
}

export async function deleteNewsAction(id: string): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بالحذف." };
    }

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from("news").delete().eq("id", id);
    revalidatePath("/");
    revalidatePath("/media");
    return { success: true, message: "تم حذف الخبر بنجاح." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء حذف الخبر." };
  }
}

// --------------------------------------------------------------------
// MEDIA (PHOTOS & VIDEOS) CMS
// --------------------------------------------------------------------
export async function getMediaAction() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

export async function saveMediaAction(formData: FormData): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بإدارة مكتبة الوسائط." };
    }

    const supabaseAdmin = createAdminClient();
    const mediaType = (formData.get("mediaType") as string || "photo").trim();
    const title = (formData.get("title") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();
    const tag = (formData.get("tag") as string || "تراث").trim();
    const url = (formData.get("url") as string || "").trim();

    if (!title || !url) {
      return { success: false, error: "يرجى أدخال عنوان المادة ورابط الصورة/الفيديو." };
    }

    await supabaseAdmin.from("media").insert({
      media_type: mediaType,
      title,
      description,
      tag,
      url,
    });

    revalidatePath("/media");
    return { success: true, message: "تم إضافة مادة جديدة إلى المعرض الرقمي." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء حفظ الوسيطة." };
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بالحذف." };
    }

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from("media").delete().eq("id", id);
    revalidatePath("/media");
    return { success: true, message: "تم حذف المادة بنجاح." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء الحذف." };
  }
}

// --------------------------------------------------------------------
// LEADERSHIP & DEPARTMENTS CMS
// --------------------------------------------------------------------
export async function getLeadershipAction() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("leadership_members")
      .select(`
        *,
        departments (
          name_ar
        )
      `)
      .order("display_order", { ascending: true });

    return data || [];
  } catch {
    return [];
  }
}

export async function saveLeadershipAction(formData: FormData): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بإدارة الهيئة القيادية." };
    }

    const supabaseAdmin = createAdminClient();
    const fullName = (formData.get("fullName") as string || "").trim();
    const roleTitle = (formData.get("roleTitle") as string || "").trim();
    const departmentId = (formData.get("departmentId") as string || null);
    const state = (formData.get("state") as string || "").trim();
    const bio = (formData.get("bio") as string || "").trim();
    const photoUrl = (formData.get("photoUrl") as string || "").trim();

    if (!fullName || !roleTitle) {
      return { success: false, error: "يرجى كتابة اسم العضو والمنصب القيادي." };
    }

    await supabaseAdmin.from("leadership_members").insert({
      full_name: fullName,
      role_title: roleTitle,
      department_id: departmentId || null,
      state,
      bio,
      photo_url: photoUrl || null,
      is_leadership_body: true,
      is_active: true,
    });

    revalidatePath("/about");
    return { success: true, message: "تم إضافة عضو جديد إلى الهيئة القيادية." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء إضافة العضو القيادي." };
  }
}

export async function deleteLeadershipAction(id: string): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بالحذف." };
    }

    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.from("leadership_members").delete().eq("id", id);
    revalidatePath("/about");
    return { success: true, message: "تم حذف العضو من الهيئة القيادية." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء الحذف." };
  }
}

// --------------------------------------------------------------------
// FAMILIES & LINEAGE CMS
// --------------------------------------------------------------------
export async function getFamiliesAction() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data } = await supabaseAdmin
      .from("families")
      .select(`
        *,
        branches (*)
      `)
      .order("created_at", { ascending: false });

    return data || [];
  } catch {
    return [];
  }
}

export async function saveFamilyAction(formData: FormData): Promise<ActionResult> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return { success: false, error: "غير مصرح لك بتعديل بيانات الأسر والأنساب." };
    }

    const supabaseAdmin = createAdminClient();
    const nameAr = (formData.get("nameAr") as string || "").trim();
    const origin = (formData.get("origin") as string || "").trim();
    const locality = (formData.get("locality") as string || "").trim();
    const description = (formData.get("description") as string || "").trim();

    if (!nameAr) {
      return { success: false, error: "يرجى كتابة اسم الأسرة / العائلة." };
    }

    await supabaseAdmin.from("families").insert({
      name_ar: nameAr,
      historical_origin: origin,
      main_locality: locality,
      description,
    });

    revalidatePath("/genealogy");
    revalidatePath("/directory");
    return { success: true, message: "تم إضافة الأسرة/العائلة بنجاح إلى قاعدة البيانات." };
  } catch {
    return { success: false, error: "حدث خطأ أثناء إضافة الأسرة." };
  }
}
