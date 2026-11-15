"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import BookmarkButton from "@/components/blog/BookmarkButton";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  author: string;
  featured: boolean;
  coverImage: string;
  cardImage?: string;
}

interface TagCount {
  tag: string;
  count: number;
}

interface BlogListProps {
  posts: BlogPost[];
  tags: TagCount[];
  summaries?: Record<string, string>;
}

export default function BlogList({ posts, tags }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const { isBookmarked, loaded: bookmarksLoaded } = useBookmarks();

  const filteredPosts = posts.filter((post) => {
    if (showBookmarked && !isBookmarked(post.slug)) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    return true;
  });

  const totalCount = posts.length;

  // Tags arrive sorted by count; show the main ones and keep the active tag visible
  const TOP_TAGS = 8;
  const visibleTags = showAllTags
    ? tags
    : tags.filter((t, i) => i < TOP_TAGS || t.tag === activeTag);
  const hiddenCount = tags.length - visibleTags.length;

  return (
    <>
      {/* Tag Filter Bar */}
      <div className="mb-10 flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTag(null); setShowBookmarked(false); }}
          className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 ${
            activeTag === null && !showBookmarked
              ? "bg-cyber-yellow/15 border-cyber-yellow/50 text-cyber-yellow"
              : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-300"
          }`}
        >
          All{" "}
          <span className="ml-1 text-[10px] opacity-70">{totalCount}</span>
        </button>
        {bookmarksLoaded && (
          <button
            onClick={() => { setShowBookmarked(!showBookmarked); setActiveTag(null); }}
            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
              showBookmarked
                ? "bg-cyber-yellow/15 border-cyber-yellow/50 text-cyber-yellow"
                : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-300"
            }`}
          >
            <svg className="w-3 h-3" fill={showBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            Saved
          </button>
        )}
        {visibleTags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`px-4 py-1.5 text-xs font-mono rounded-full border transition-all duration-300 ${
              activeTag === tag
                ? "bg-cyber-yellow/15 border-cyber-yellow/50 text-cyber-yellow"
                : "bg-white/5 border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-300"
            }`}
          >
            {tag}{" "}
            <span className="ml-1 text-[10px] opacity-70">{count}</span>
          </button>
        ))}
        {(hiddenCount > 0 || showAllTags) && (
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            className="px-4 py-1.5 text-xs font-mono rounded-full border border-dashed border-white/15 text-neutral-500 hover:border-white/30 hover:text-neutral-300 transition-all duration-300"
          >
            {showAllTags ? "Fewer tags" : `+${hiddenCount} more`}
          </button>
        )}
      </div>

      {/* Blog Cards: newest post as a large feature, the rest in a grid */}
      <div className="flex flex-col gap-6 md:gap-8">
        {(() => {
          const showHero = !activeTag && !showBookmarked && filteredPosts.length > 0;
          const hero = showHero ? filteredPosts[0] : null;
          const rest = showHero ? filteredPosts.slice(1) : filteredPosts;
          const fmt = (d: string) =>
            new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          return (
            <>
              {hero && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Link
                    href={`/blog/${hero.slug}`}
                    className="group grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-cyber-yellow/40 md:grid-cols-[1.25fr_1fr]"
                  >
                    {(hero.cardImage || hero.coverImage) && (
                      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900 md:aspect-auto md:min-h-[360px]">
                        <Image
                          src={hero.coverImage || hero.cardImage!}
                          alt=""
                          fill
                          priority
                          sizes="(max-width: 768px) 100vw, 60vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center gap-4 p-6 md:p-10">
                      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-neutral-500">
                        <span className="rounded-full border border-cyber-yellow/40 px-2.5 py-0.5 uppercase tracking-wider text-cyber-yellow">
                          Latest
                        </span>
                        <span>{fmt(hero.date)}</span>
                        <span>·</span>
                        <span>{hero.readTime}</span>
                      </div>
                      <h2 className="font-mono text-2xl font-bold leading-tight text-white transition-colors group-hover:text-cyber-yellow md:text-4xl">
                        {hero.title}
                      </h2>
                      <p className="leading-relaxed text-neutral-400 md:text-lg">{hero.description}</p>
                      <div className="mt-2 flex items-center gap-2 font-mono text-sm text-cyber-yellow">
                        <span>Read article →</span>
                        <BookmarkButton slug={hero.slug} className="ml-auto" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {rest.map((post, index) => {
                    const img = post.cardImage || post.coverImage;
                    return (
                      <motion.div
                        key={post.slug}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
                      >
                        <Link
                          href={`/blog/${post.slug}`}
                          className="group flex h-full flex-row overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-cyber-yellow/40 sm:flex-col"
                        >
                          {img && (
                            <div className="relative w-28 shrink-0 overflow-hidden border-r border-white/10 bg-neutral-900 sm:aspect-[16/10] sm:w-auto sm:border-b sm:border-r-0">
                              <Image
                                src={img}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              />
                            </div>
                          )}
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:gap-2.5 sm:p-5">
                            <div className="flex items-center gap-2 font-mono text-xs text-neutral-500">
                              <span>{fmt(post.date)}</span>
                              <span>·</span>
                              <span>{post.readTime}</span>
                            </div>
                            <h2 className="font-mono text-sm font-bold leading-snug text-white transition-colors group-hover:text-cyber-yellow sm:text-lg">
                              {post.title}
                            </h2>
                            <p className="hidden text-sm leading-relaxed text-neutral-400 sm:line-clamp-3">{post.description}</p>
                            <div className="mt-auto flex items-center gap-2 pt-3">
                              <div className="hidden min-w-0 flex-wrap gap-1.5 sm:flex">
                                {post.tags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className={`rounded border px-1.5 py-0.5 font-mono text-[11px] ${
                                      activeTag === tag
                                        ? "border-cyber-yellow/30 text-cyber-yellow"
                                        : "border-white/10 text-neutral-500"
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <BookmarkButton slug={post.slug} className="ml-auto shrink-0" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </>
          );
        })()}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500 font-mono">
              {showBookmarked
                ? "No bookmarked posts yet. Save posts to find them here."
                : "No posts found for this tag."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
