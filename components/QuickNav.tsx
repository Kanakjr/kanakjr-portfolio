"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";


export default function QuickNav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Blog", href: "/blog" },
    { label: "Stills", href: "/stills" },
    { label: "Reels", href: "/reels" },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      {/* ========== DESKTOP LAYOUT (md and up) ========== */}

      {/* Desktop Logo */}
      <Link
        href="/"
        className="hidden md:flex fixed top-8 left-8 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyber-yellow/50 transition-all duration-300 hover:scale-110 cursor-pointer"
      >
        <div className="relative w-6 h-6">
          <Image
            src="/logokanakjr.png"
            alt="Kanak Jr Logo"
            fill
            className="rounded-full object-cover"
            priority
          />
        </div>
      </Link>

      {/* Desktop Nav links */}
      <nav className="hidden md:flex fixed top-8 left-28 z-50 gap-2">
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
            <span
              className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-cyber-yellow transition-all duration-300 ${
                hoveredItem === item.label ? "w-3/4" : "w-0"
              }`}
            />
          </Link>
        ))}
      </nav>

      {/* Desktop Icon buttons */}
      <div className="hidden md:flex fixed top-8 right-20 z-50 gap-2">
        <button
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "`" })
            )
          }
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:border-cyber-yellow/50 transition-all duration-300 hover:scale-110 group"
          title="Terminal (` key)"
        >
          <svg
            className="w-4 h-4 text-white/80 group-hover:text-cyber-yellow transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </button>
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
            <circle cx="5" cy="6" r="2" />
            <circle cx="19" cy="6" r="2" />
            <circle cx="12" cy="18" r="2" />
            <circle cx="12" cy="11" r="2" />
            <path strokeLinecap="round" d="M7 7l3 3M17 7l-3 3M12 13v3" />
          </svg>
        </Link>
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

      {/* ========== MOBILE LAYOUT (below md) ========== */}
      <div className="flex md:hidden fixed top-4 left-4 right-4 z-50 items-center justify-between">
        {/* Mobile Logo */}
        <Link
          href="/"
          className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300"
        >
          <div className="relative w-5 h-5">
            <Image
              src="/logokanakjr.png"
              alt="Kanak Jr Logo"
              fill
              className="rounded-full object-cover"
              priority
            />
          </div>
        </Link>

        {/* Right side: icons + hamburger */}
        <div className="relative flex items-center gap-1.5" ref={menuRef}>
          {/* Graph icon */}
          <Link
            href="/graph"
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group"
          >
            <svg
              className="w-3.5 h-3.5 text-white/80 group-hover:text-cyber-yellow transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
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
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300 group"
          >
            <svg
              className="w-3.5 h-3.5 text-white/80 group-hover:text-cyber-yellow transition-colors"
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

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-300"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-3.5 h-3.5 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Dropdown menu */}
          <div
            className={`absolute top-full right-0 mt-2 flex flex-col gap-1 p-2 rounded-xl bg-black/90 backdrop-blur-md border border-white/15 shadow-2xl transition-all duration-200 origin-top-right ${
              menuOpen
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={handleNavClick}
                className="px-5 py-2.5 rounded-lg text-sm font-mono text-white/80 hover:text-cyber-yellow hover:bg-white/5 transition-all duration-200 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
