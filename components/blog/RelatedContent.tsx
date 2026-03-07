import Link from "next/link";
import { type SearchResult } from "@/lib/knowledge";

const SOURCE_COLORS: Record<string, string> = {
  blog: "text-emerald-400 border-emerald-400/30",
  projects: "text-blue-400 border-blue-400/30",
  experience: "text-purple-400 border-purple-400/30",
  videos: "text-red-400 border-red-400/30",
  patents: "text-amber-400 border-amber-400/30",
};

export default function RelatedContent({ items }: { items: SearchResult[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider mb-6">
        Related Content
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.id} href={item.url}>
            <div className="group p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-cyber-yellow/30 hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-white font-mono truncate group-hover:text-cyber-yellow transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                    {item.snippet}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                    SOURCE_COLORS[item.source] || "text-neutral-400 border-white/10"
                  }`}
                >
                  {item.source}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
