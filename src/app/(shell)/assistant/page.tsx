import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";
import RequestState from "@/components/ui/RequestState";
import PaywallGate from "@/components/ui/PaywallGate";
import Disclaimer from "@/components/ui/Disclaimer";
import type { Plan } from "@/lib/access";
import { useAuth } from "@/context/AuthContext";

export default function AssistantPage() {
  const { plan: _plan } = useAuth();
  const plan = (_plan?.name ?? "").toLowerCase().includes("elite")
    ? ("elite" as Plan)
    : (_plan?.name ?? "").toLowerCase().includes("pro")
    ? ("pro" as Plan)
    : ("free" as Plan);

  return (
    <RequestState>
      <PageTransition>
        <div className="container mx-auto max-w-7xl px-6 py-8 h-full flex flex-col">
        <h1 className="text-3xl font-bold text-white mb-6 tracking-tighter">
          Assistant
        </h1>
        <div className="glass flex-grow p-6 flex flex-col">
          <Disclaimer />

          <div className="flex-grow space-y-4">
            <div className="bg-white/10 p-4 rounded-lg self-start max-w-lg">
              <p>Hello! How can I help you today?</p>
            </div>

            <div className="bg-brand-blue/50 p-4 rounded-lg self-end max-w-lg text-right">
              <p>What&apos;s the prediction for Bitcoin tomorrow?</p>
            </div>
          </div>

          {/* Gate the interactive assistant input behind Elite super_ai */}
          {/* wire user's plan to the gate */}
          <PaywallGate feature="super_ai" plan={plan} title="Assistant · Super AI" description="Access the full Super AI assistant for longer context and unlimited prompts.">
            <div className="flex gap-4 mt-6">
              <Input placeholder="Ask me anything..." />
              <Button>Send</Button>
            </div>
          </PaywallGate>
        </div>
        </div>
      </PageTransition>
    </RequestState>
  );
}
