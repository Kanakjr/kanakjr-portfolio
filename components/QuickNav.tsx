"use client";

import Link from "next/link";
import { useState } from "react";

export default function QuickNav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    { label: "Blog", href: "/blog", icon: "📝" },
    { label: "Stills", href: "/stills", icon: "📸" },
    { label: "Reels", href: "/reels", icon: "🎬" },
  ];

  return (
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
  );
}
