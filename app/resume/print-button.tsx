"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
    >
      Print / Save PDF
    </button>
  );
}
