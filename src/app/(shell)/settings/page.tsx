"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { token, plan, isLoading, setToken, logout, refreshPlan } = useAuth();
  const [input, setInput] = React.useState<string>("");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-sm text-slate-400">Current token:</div>
          <pre className="mt-1 max-w-full overflow-x-auto rounded bg-black/30 p-2 text-xs">
            {token ?? "(none)"}
          </pre>
        </div>

        <div>
          <div className="text-sm text-slate-400">Plan:</div>
          <div className="mt-1 text-sm">
            {isLoading ? "Loading…" : plan?.name ?? "(not set)"}
          </div>
          {plan ? (
            <pre className="mt-2 max-w-full overflow-x-auto rounded bg-black/30 p-2 text-xs">
              {JSON.stringify(plan, null, 2)}
            </pre>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            className="w-full max-w-xl rounded bg-black/20 p-2 text-sm"
            placeholder="Paste token"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="rounded bg-emerald-600 px-3 py-2 text-sm"
            onClick={() => {
              const t = input.trim();
              if (!t) return;
              setToken(t);
              setInput("");
            }}
          >
            Save token
          </button>

          <button
            className="rounded bg-slate-700 px-3 py-2 text-sm"
            onClick={() => void refreshPlan()}
          >
            Refresh plan
          </button>

          <button
            className="rounded bg-red-600 px-3 py-2 text-sm"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
