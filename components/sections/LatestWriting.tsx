import Image from "next/image";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export default function LatestWriting() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="writing" className="relative px-4 py-14 md:py-20">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-4 md:mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
              Latest <span className="text-cyber-yellow">writing</span>
            </h2>
            <p className="text-neutral-400 md:text-lg">
              Build logs from the home lab, the workshop, and work.
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 font-mono text-sm text-neutral-400 transition-colors hover:text-cyber-yellow sm:inline"
          >
            All posts →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
          {posts.map((post) => {
            const img = post.cardImage || post.coverImage;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-row overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-cyber-yellow/40 md:flex-col"
              >
                {img && (
                  <div className="relative w-28 shrink-0 overflow-hidden border-r border-white/10 bg-neutral-900 md:aspect-[16/10] md:w-auto md:border-b md:border-r-0">
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 112px, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 md:gap-2 md:p-5">
                  <span className="font-mono text-xs text-neutral-500">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {post.readTime ? ` · ${post.readTime}` : ""}
                  </span>
                  <h3 className="font-mono text-sm font-bold leading-snug text-white transition-colors group-hover:text-cyber-yellow md:text-lg">
                    {post.title}
                  </h3>
                  <p className="hidden text-sm leading-relaxed text-neutral-400 md:line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          href="/blog"
          className="mt-6 inline-block font-mono text-sm text-neutral-400 transition-colors hover:text-cyber-yellow sm:hidden"
        >
          All posts →
        </Link>
      </div>
    </section>
  );
}
