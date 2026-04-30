"use client";

import { useState } from "react";
import Image from "next/image";
import { StoryViewer } from "./story-viewer";
import type { InstagramHighlight } from "@/lib/instagram";

interface HighlightsRowProps {
  highlights: InstagramHighlight[];
  username?: string;
}

export function HighlightsRow({ highlights, username }: HighlightsRowProps) {
  const [active, setActive] = useState<InstagramHighlight | null>(null);

  if (!highlights.length) return null;

  return (
    <div className="mb-10">
      <div className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {highlights.map((h) => (
          <button
            key={h.id}
            type="button"
            onClick={() => setActive(h)}
            className="group flex shrink-0 flex-col items-center gap-2 focus:outline-none"
            aria-label={`Open ${h.title} highlight`}
          >
            <span className="relative block size-20 rounded-full bg-gradient-to-tr from-cyber-yellow via-retro-red to-cyber-yellow p-[3px] transition-transform group-hover:scale-105 md:size-24">
              <span className="block size-full rounded-full bg-background p-[2px]">
                <Image
                  src={h.cover}
                  alt={h.title}
                  width={96}
                  height={96}
                  className="size-full rounded-full object-cover"
                  unoptimized
                />
              </span>
            </span>
            <span className="max-w-[5.5rem] truncate font-mono text-xs text-neutral-300">
              {h.title}
            </span>
          </button>
        ))}
      </div>

      <StoryViewer
        highlight={active}
        username={username}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

export default HighlightsRow;
