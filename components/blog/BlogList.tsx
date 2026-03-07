"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MagicCard from "@/components/magicui/magic-card";
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

export default function BlogList({ posts, tags, summaries = {} }: BlogListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);
  const { isBookmarked, loaded: bookmarksLoaded } = useBookmarks();

  const filteredPosts = posts.filter((post) => {
    if (showBookmarked && !isBookmarked(post.slug)) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    return true;
  });

  const totalCount = posts.length;

  return (
    <>
      {/* Tag Filter Bar */}
      <div className="mb-12 flex flex-wrap gap-2 justify-center">
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
        {tags.map(({ tag, count }) => (
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
      </div>

      {/* Blog Cards */}
      <div className="flex flex-col gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <MagicCard className="p-0 hover:border-cyber-yellow/30 transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="flex flex-row-reverse">
                    {/* Text content */}
                    <div className="flex flex-col gap-4 p-8 flex-1 min-w-0">
                      {/* Meta */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {post.featured && (
                          <span className="px-2.5 py-0.5 text-[10px] font-mono rounded-full bg-retro-red/10 text-retro-red border border-retro-red/20 uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                        <span className="text-xs font-mono text-neutral-500">
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-xs font-mono text-neutral-600">
                          /
                        </span>
                        <span className="text-xs font-mono text-neutral-500">
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-bold text-white font-mono transition-colors md:text-3xl">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-neutral-400 leading-relaxed">
                        {post.description}
                      </p>

                      {/* AI Summary */}
                      {summaries[post.slug] && (
                        <p className="text-xs text-neutral-500 italic border-l-2 border-cyber-yellow/20 pl-3">
                          <span className="text-cyber-yellow/50 not-italic font-mono text-[10px] mr-1">AI</span>
                          {summaries[post.slug].length > 150
                            ? summaries[post.slug].slice(0, 150) + "..."
                            : summaries[post.slug]}
                        </p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 text-xs font-mono border rounded transition-colors ${
                              activeTag === tag
                                ? "text-cyber-yellow border-cyber-yellow/30"
                                : "text-neutral-500 border-white/10"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More + Bookmark */}
                      <div className="flex items-center gap-2 mt-2 text-sm font-mono text-cyber-yellow/70 transition-colors">
                        <span>Read article</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                        <BookmarkButton slug={post.slug} className="ml-auto" />
                      </div>
                    </div>

                    {/* Cover image on left */}
                    {post.coverImage && (
                      <div className="relative hidden md:block w-64 flex-shrink-0">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="256px"
                        />
                        {/* Yellow gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/60 to-cyber-yellow/20" />
                      </div>
                    )}
                  </div>
                </MagicCard>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

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
