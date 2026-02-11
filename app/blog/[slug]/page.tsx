"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { portfolioData } from "@/lib/data";
import { notFound } from "next/navigation";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = portfolioData.blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative min-h-screen bg-background">
      {/* Subtle grid background */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,215,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-32">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors mb-12"
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
            All Posts
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
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
            <span className="text-xs font-mono text-neutral-600">/</span>
            <span className="text-xs font-mono text-neutral-500">
              {post.readTime}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-white font-mono leading-tight md:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 h-0.5 w-20 bg-gradient-to-r from-cyber-yellow to-retro-red" />
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {post.content.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <p
                  key={index}
                  className="text-neutral-300 leading-relaxed text-lg"
                >
                  {block.text}
                </p>
              );
            }

            if (block.type === "heading") {
              return (
                <h2
                  key={index}
                  className="text-2xl font-bold text-white font-mono mt-10 mb-4"
                >
                  {block.text}
                </h2>
              );
            }

            if (block.type === "code") {
              return (
                <div
                  key={index}
                  className="relative rounded-lg border border-white/10 bg-white/5 overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-retro-red/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-cyber-yellow/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs font-mono text-neutral-500">
                      {block.language}
                    </span>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-neutral-300 leading-relaxed">
                      {block.text}
                    </code>
                  </pre>
                </div>
              );
            }

            return null;
          })}
        </motion.article>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono text-neutral-400 border border-white/10 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex justify-between items-center"
        >
          <Link
            href="/blog"
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
            All Posts
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            Home
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
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
