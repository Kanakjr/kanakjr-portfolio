import Link from "next/link";
import RetroGrid from "@/components/magicui/retro-grid";
import BlogList from "@/components/blog/BlogList";
import { getAllPosts, getAllTags, getBlogSummaries } from "@/lib/blog";

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const summaries = getBlogSummaries();

  // Strip content before passing to client component
  const postsWithoutContent = posts.map(({ content, ...rest }) => rest);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-32">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
            The <span className="text-cyber-yellow">Blog</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Thoughts on AI, cybersecurity, and building things that matter.
          </p>
          <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
          <Link
            href="/feed.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-mono text-neutral-500 hover:text-cyber-yellow transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
            </svg>
            RSS Feed
          </Link>
        </div>

        {/* Blog List with Tag Filtering */}
        <BlogList posts={postsWithoutContent} tags={tags} summaries={summaries} />

        {/* Back to Home */}
        <div className="mt-16 text-center">
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
        </div>
      </div>
    </main>
  );
}
