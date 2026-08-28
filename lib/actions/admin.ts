"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminMetrics {
  totalMembers: number;
  pendingMembers: number;
  activeMembers: number;
  pendingPaymentsCount: number;
  approvedPaymentsTotal: number;
  socialRequestsCount: number;
  newsCount: number;
}

/**
 * Server-side helper to strictly verify caller has administrative session & permissions.
 * STRICT SECURITY: Rely ONLY on user_roles table.
 */
export async function verifyAdminUser() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { authorized: false, user: null, reason: "المستخدم غير مسجّل دخول" };
  }

  const supabaseAdmin = createAdminClient();
  const { data: userRoles } = await supabaseAdmin
    .from("user_roles")
    .select("roles(code)")
    .eq("user_id", user.id);

  const roles = userRoles?.map((r: any) => r.roles?.code) || [];
  const isAdmin = roles.some((role: string) =>
    ["super_admin", "secretary_general", "finance_manager", "executive_council"].includes(role)
  );

  if (isAdmin) {
    return { authorized: true, user, roles };
  }

  return { authorized: false, user, reason: "لا تملك الصلاحيات الإدارية المطلوبة" };
}

export async function getAdminMetricsAction(): Promise<AdminMetrics> {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return {
        totalMembers: 0,
        pendingMembers: 0,
        activeMembers: 0,
        pendingPaymentsCount: 0,
        approvedPaymentsTotal: 0,
        socialRequestsCount: 0,
        newsCount: 0,
      };
    }

    const supabaseAdmin = createAdminClient();

    const { count: totalMembers } = await supabaseAdmin
      .from("members")
      .select("*", { count: "exact", head: true });

    const { count: pendingMembers } = await supabaseAdmin
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    const { count: activeMembers } = await supabaseAdmin
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    const { count: pendingPaymentsCount } = await supabaseAdmin
      .from("payment_receipts")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_review");

    const { data: approvedReceipts } = await supabaseAdmin
      .from("payment_receipts")
      .select("amount")
      .eq("status", "approved");

    const approvedPaymentsTotal = approvedReceipts
      ? approvedReceipts.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
      : 0;

    const { count: socialRequestsCount } = await supabaseAdmin
      .from("social_requests")
      .select("*", { count: "exact", head: true });

    const { count: newsCount } = await supabaseAdmin
      .from("news")
      .select("*", { count: "exact", head: true });

    return {
      totalMembers: totalMembers || 0,
      pendingMembers: pendingMembers || 0,
      activeMembers: activeMembers || 0,
      pendingPaymentsCount: pendingPaymentsCount || 0,
      approvedPaymentsTotal,
      socialRequestsCount: socialRequestsCount || 0,
      newsCount: newsCount || 0,
    };
  } catch (err) {
    console.error("Get Admin Metrics Error:", err);
    return {
      totalMembers: 0,
      pendingMembers: 0,
      activeMembers: 0,
      pendingPaymentsCount: 0,
      approvedPaymentsTotal: 0,
      socialRequestsCount: 0,
      newsCount: 0,
    };
  }
}

export async function getAllMembersAdminAction() {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) return [];

    const supabaseAdmin = createAdminClient();
    const { data: members } = await supabaseAdmin
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    return members || [];
  } catch {
    return [];
  }
}

export async function getPendingPaymentsAction() {
  try {
    const authCheck = await verifyAdminUser();
    if (!authCheck.authorized) {
      return [];
    }

    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("payment_receipts")
      .select(`
        id,
        amount,
        payment_type,
        transaction_reference,
        payment_date,
        receipt_path,
        notes,
        status,
        created_at,
        members (
          full_name,
          membership_number
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get Pending Payments Error:", error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}
