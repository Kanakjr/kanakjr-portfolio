"use client";

import Link from "next/link";
import { useState } from "react";

export default function QuickNav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { label: "Blog", href: "/blog" },
    { label: "Stills", href: "/stills" },
    { label: "Reels", href: "/reels" },
  ];

  return (
    <>
      <nav className="fixed top-8 left-28 z-50 flex gap-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyber-yellow/50 transition-all duration-300 hover:scale-105"
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span className="text-xs font-mono text-white/80 group-hover:text-cyber-yellow transition-colors">
              {item.label}
            </span>

            {/* Animated underline */}
            <span
              className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-cyber-yellow transition-all duration-300 ${
                hoveredItem === item.label ? "w-3/4" : "w-0"
              }`}
            />
          </Link>
        ))}
      </nav>

      {/* Icon buttons -- fixed to far right */}
      <div className="fixed top-8 right-20 z-50 flex gap-2">
        {/* Graph icon */}
        <Link
          href="/graph"
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyber-yellow/50 transition-all duration-300 hover:scale-110 group"
        >
          <svg
            className="w-4 h-4 text-white/80 group-hover:text-cyber-yellow transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {/* Connected nodes / knowledge graph icon */}
            <circle cx="5" cy="6" r="2" />
            <circle cx="19" cy="6" r="2" />
            <circle cx="12" cy="18" r="2" />
            <circle cx="12" cy="11" r="2" />
            <path strokeLinecap="round" d="M7 7l3 3M17 7l-3 3M12 13v3" />
          </svg>
        </Link>

        {/* Search icon */}
        <Link
          href="/search"
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyber-yellow/50 transition-all duration-300 hover:scale-110 group"
        >
          <svg
            className="w-4 h-4 text-white/80 group-hover:text-cyber-yellow transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </Link>
      </div>
    </>
  );
}
