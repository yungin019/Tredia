"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { ApiError } from "@/lib/apiErrors";

type RequestStateProps = {
  loading?: boolean;
  error?: ApiError | null;
  empty?: boolean;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
};

export default function RequestState({
  loading = false,
  error = null,
  empty = false,
  onRetry,
  loadingMessage = "Loading…",
  emptyMessage = "Nothing to show.",
  children,
}: RequestStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-300">
        <svg
          className="mr-3 h-5 w-5 animate-spin text-slate-300"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.2" />
          <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span>{loadingMessage}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-slate-200">
        <div className="mb-3 text-sm text-red-300">{error.message}</div>
        <div className="flex items-center gap-3">
          {error.isRetryable && onRetry ? (
            <Button onClick={onRetry}>Retry</Button>
          ) : null}
          <div className="text-xs text-slate-400">
            {error.status ? `Status: ${error.status}` : null}
            {error.isNetworkError ? " • Network" : ""}
          </div>
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="p-6 text-slate-400">
        <div className="text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return <>{children}</>;
}
