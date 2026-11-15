"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="rounded-lg bg-cyber-yellow px-4 py-2 font-mono text-sm font-semibold text-black transition-opacity hover:opacity-85"
    >
      Download PDF
    </button>
  );
}
