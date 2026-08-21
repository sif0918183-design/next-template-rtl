"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface ApprovedFinancialStats {
  totalApprovedDonations: number;
  totalApprovedMemberships: number;
  activeCampaignsCount: number;
  approvedProjectsCount: number;
}

/**
 * Strictly calculates financial metrics using ONLY approved payments.
 */
export async function getApprovedFinancialStatsAction(): Promise<ApprovedFinancialStats> {
  try {
    const supabaseAdmin = createAdminClient();

    // Sum approved donation receipts
    const { data: approvedDonations } = await supabaseAdmin
      .from("payment_receipts")
      .select("amount")
      .eq("payment_type", "donation")
      .eq("status", "approved");

    const totalApprovedDonations = approvedDonations
      ? approvedDonations.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      : 0;

    // Sum approved membership receipts
    const { data: approvedMemberships } = await supabaseAdmin
      .from("payment_receipts")
      .select("amount")
      .eq("payment_type", "membership")
      .eq("status", "approved");

    const totalApprovedMemberships = approvedMemberships
      ? approvedMemberships.reduce((sum, item) => sum + Number(item.amount || 0), 0)
      : 0;

    // Count active campaigns
    const { count: campaignsCount } = await supabaseAdmin
      .from("donation_campaigns")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    return {
      totalApprovedDonations,
      totalApprovedMemberships,
      activeCampaignsCount: campaignsCount || 0,
      approvedProjectsCount: 0,
    };
  } catch (err) {
    console.error("Get Approved Financial Stats Error:", err);
    return {
      totalApprovedDonations: 0,
      totalApprovedMemberships: 0,
      activeCampaignsCount: 0,
      approvedProjectsCount: 0,
    };
  }
}
