"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plan, hasAccess, requireAccess } from "@/lib/access";

type PaywallGateProps = {
  plan?: Plan;
  feature: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function PaywallGate({ plan, feature, children, title, description }: PaywallGateProps) {
  const access = requireAccess(plan, feature);

  if (access.ok) return <>{children}</>;

  const upgradeLabel = feature === "super_ai" ? "Upgrade to Elite" : "Upgrade to Pro";

  return (
    <div className="rounded-2xl border border-white/8 bg-[#071023] p-6 text-slate-200">
      <h3 className="text-lg font-semibold text-white">{title ?? "Premium feature"}</h3>
      <p className="mt-2 text-sm text-slate-300">{description ?? access.reason}</p>

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={() => (window.location.href = "/pricing")}>{upgradeLabel}</Button>
        <a href="/pricing" className="text-sm text-slate-300 underline">See plans</a>
      </div>
    </div>
  );
}
