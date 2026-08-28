import React from "react";
import { getMembershipPlansAction, getMonthlyMembershipGoalAction } from "@/lib/actions/membership";
import { getPaymentMethodsAction } from "@/lib/actions/payments";
import MembershipSelectClient from "./membership-select-client";

export const dynamic = "force-dynamic";

export default async function SelectMembershipPlanPage() {
  const plans = await getMembershipPlansAction();
  const goal = await getMonthlyMembershipGoalAction();
  const bankMethods = await getPaymentMethodsAction();

  return (
    <MembershipSelectClient
      plans={plans}
      goal={goal}
      bankMethods={bankMethods}
    />
  );
}
