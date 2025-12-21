import React from "react";

type DisclaimerProps = {
  text?: string;
};

export default function Disclaimer({ text = "Informational only — not financial advice." }: DisclaimerProps) {
  return <div className="mt-3 text-xs text-slate-400">{text}</div>;
}
