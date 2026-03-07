import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, getBlogSummary } from "@/lib/blog";
import { getRelatedContent } from "@/lib/knowledge";
import RelatedContent from "@/components/blog/RelatedContent";
import ReadingProgress from "@/components/blog/ReadingProgress";
import BookmarkButton from "@/components/blog/BookmarkButton";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedItems = getRelatedContent(`blog-${slug}`, 4);
  const summary = getBlogSummary(slug);

  return (
    <main className="relative min-h-screen bg-background">
      <ReadingProgress />
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

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
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
            <span className="text-xs font-mono text-neutral-600">/</span>
            <span className="text-xs font-mono text-neutral-500">
              {post.readTime}
            </span>
            <span className="text-xs font-mono text-neutral-600">/</span>
            <span className="text-xs font-mono text-neutral-500">
              {post.author}
            </span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="text-4xl font-bold text-white font-mono leading-tight md:text-5xl">
              {post.title}
            </h1>
            <BookmarkButton slug={slug} className="flex-shrink-0 mt-2" />
          </div>

          <div className="mt-6 h-0.5 w-20 bg-gradient-to-r from-cyber-yellow to-retro-red" />
        </header>

        {/* AI-generated TL;DR */}
        {summary && (
          <div className="mb-10 p-5 rounded-xl border border-cyber-yellow/20 bg-cyber-yellow/[0.03]">
            <p className="text-[11px] font-mono text-cyber-yellow/70 uppercase tracking-wider mb-2">
              TL;DR -- AI Summary
            </p>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* MDX Content */}
        <article className="prose-blog">
          <MDXRemote source={post.content} />
        </article>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
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
        </div>

        {/* Related Content */}
        <RelatedContent items={relatedItems} />

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center">
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
        </div>
      </div>
    </main>
  );
}
