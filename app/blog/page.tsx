"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MagicCard from "@/components/magicui/magic-card";
import RetroGrid from "@/components/magicui/retro-grid";
import { portfolioData } from "@/lib/data";

export default function BlogPage() {
  const { blogPosts } = portfolioData;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
            The <span className="text-cyber-yellow">Blog</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Thoughts on AI, cybersecurity, and building things that matter.
          </p>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
        </motion.div>

        {/* Blog Cards */}
        <div className="flex flex-col gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <MagicCard className="p-8 hover:border-cyber-yellow/30 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col gap-4">
                    {/* Category & Meta */}
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs font-mono rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/20">
                        {post.category}
                      </span>
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
                    <h2 className="text-2xl font-bold text-white font-mono group-hover:text-cyber-yellow transition-colors md:text-3xl">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-neutral-400 leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs font-mono text-neutral-500 border border-white/10 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <div className="flex items-center gap-2 mt-2 text-sm font-mono text-cyber-yellow/70 group-hover:text-cyber-yellow transition-colors">
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
                    </div>
                  </div>
                </MagicCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
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
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
