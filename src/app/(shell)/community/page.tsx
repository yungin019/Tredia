import PaywallGate from "@/components/ui/PaywallGate";
import Disclaimer from "@/components/ui/Disclaimer";
import { useAuth } from "@/context/AuthContext";
import type { Plan } from "@/lib/access";

export default function CommunityPage() {
  const { plan: _plan } = useAuth();
  const plan = (_plan?.name ?? "").toLowerCase().includes("elite")
    ? ("elite" as Plan)
    : (_plan?.name ?? "").toLowerCase().includes("pro")
    ? ("pro" as Plan)
    : ("free" as Plan);
  return (
    <PaywallGate feature="community" plan={plan} title="Community">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Community</h1>
        <Disclaimer />
        <p>Placeholder content for the community page.</p>
      </div>
    </PaywallGate>
  );
}
