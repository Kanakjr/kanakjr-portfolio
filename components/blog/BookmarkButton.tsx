"use client";

import { useBookmarks } from "@/lib/hooks/useBookmarks";

export default function BookmarkButton({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const { isBookmarked, toggle, loaded } = useBookmarks();

  if (!loaded) return null;

  const active = isBookmarked(slug);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`transition-colors ${className}`}
      title={active ? "Remove bookmark" : "Bookmark this post"}
    >
      <svg
        className={`w-4 h-4 ${
          active ? "text-cyber-yellow fill-cyber-yellow" : "text-neutral-500 hover:text-cyber-yellow"
        }`}
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}
