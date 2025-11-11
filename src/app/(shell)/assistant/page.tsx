import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";

export default function AssistantPage() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 py-8 h-full flex flex-col">
        <h1 className="text-2xl font-bold text-white mb-8 tracking-tighter">
          AI Assistant
        </h1>
        <div className="glass flex-grow p-6 flex flex-col">
          <div className="flex-grow space-y-4">
            <div className="bg-white/10 p-4 rounded-lg self-start max-w-lg">
              <p>Hello! How can I help you today?</p>
            </div>
            <div className="bg-brand-blue/50 p-4 rounded-lg self-end max-w-lg text-right">
              <p>What&apos;s the prediction for Bitcoin tomorrow?</p>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <Input placeholder="Ask me anything..." />
            <Button>Send</Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
