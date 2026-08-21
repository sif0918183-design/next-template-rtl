"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface PublicSiteStats {
  totalActiveMembers: number;
  totalApprovedDonations: number;
  activeCampaignsCount: number;
  totalApprovedMemberships: number;
}

/**
 * Public Server Action to fetch live database counts for the homepage.
 * Does NOT require admin privileges and respects zero fallback state.
 */
export async function getPublicSiteStatsAction(): Promise<PublicSiteStats> {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Total active members
    const { count: activeMembersCount } = await supabaseAdmin
      .from("members")
      .select("*", { count: "exact", head: true })
      .eq("status", "active");

    // 2. Total approved donations
    const { data: approvedDonations } = await supabaseAdmin
      .from("payment_receipts")
      .select("amount")
      .eq("payment_type", "donation")
      .eq("status", "approved");

    const totalApprovedDonations = approvedDonations
      ? approvedDonations.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      : 0;

    // 3. Approved memberships total
    const { data: approvedMemberships } = await supabaseAdmin
      .from("payment_receipts")
      .select("amount")
      .eq("payment_type", "membership")
      .eq("status", "approved");

    const totalApprovedMemberships = approvedMemberships
      ? approvedMemberships.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      : 0;

    // 4. Active campaigns
    const { count: campaignsCount } = await supabaseAdmin
      .from("donation_campaigns")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    return {
      totalActiveMembers: activeMembersCount || 0,
      totalApprovedDonations,
      activeCampaignsCount: campaignsCount || 0,
      totalApprovedMemberships,
    };
  } catch (err) {
    console.error("Get Public Site Stats Error:", err);
    return {
      totalActiveMembers: 0,
      totalApprovedDonations: 0,
      activeCampaignsCount: 0,
      totalApprovedMemberships: 0,
    };
  }
}
