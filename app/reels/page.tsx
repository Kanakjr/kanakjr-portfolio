"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import RetroGrid from "@/components/magicui/retro-grid";
import MagicCard from "@/components/magicui/magic-card";
import { HeroVideoDialog } from "@/components/magicui/hero-video-dialog";
import {
  videosData,
  getEmbedUrl,
  getThumbnailUrl,
} from "@/lib/videos";

export default function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const featuredVideo = videosData.find((v) => v.featured) ?? videosData[0];

  const categories = useMemo(() => {
    const cats = Array.from(new Set(videosData.map((v) => v.category)));
    return ["All", ...cats];
  }, []);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") return videosData;
    return videosData.filter((v) => v.category === activeCategory);
  }, [activeCategory]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-32">
        {/* Page Header */}
        <BlurFade delay={0.1} inView>
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
              <span className="text-cyber-yellow">Reels</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Project demos, walkthroughs, and technical deep dives -- in motion
            </p>
            <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
          </div>
        </BlurFade>

        {/* Featured Video */}
        <BlurFade delay={0.2} inView>
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-mono">
                Featured
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-cyber-yellow/40 to-transparent" />
            </div>

            <MagicCard
              className="overflow-hidden"
              gradientSize={400}
              gradientColor="#FFD700"
              gradientOpacity={0.15}
            >
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-3">
                  <HeroVideoDialog
                    animationStyle="from-center"
                    videoSrc={getEmbedUrl(featuredVideo.youtubeId)}
                    thumbnailSrc={getThumbnailUrl(featuredVideo.youtubeId)}
                    thumbnailAlt={featuredVideo.title}
                  />
                </div>
                <div className="md:col-span-2 p-6 md:p-8 flex flex-col justify-center">
                  <span className="inline-block w-fit mb-3 px-3 py-1 text-xs font-mono font-semibold tracking-wider uppercase rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/20">
                    {featuredVideo.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white font-mono mb-3">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                    {featuredVideo.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredVideo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs font-mono text-neutral-500 border border-white/10 rounded-md bg-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </MagicCard>
          </div>
        </BlurFade>

        {/* Category Filter + Grid Header */}
        <BlurFade delay={0.3} inView>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-mono whitespace-nowrap">
                All Videos
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-cyber-yellow/40 to-transparent" />
              <span className="text-sm font-mono text-neutral-500 whitespace-nowrap">
                {filteredVideos.length} videos
              </span>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-full border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-cyber-yellow text-black border-cyber-yellow"
                      : "bg-white/5 text-neutral-400 border-white/10 hover:border-cyber-yellow/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </BlurFade>

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <BlurFade
              key={video.id}
              delay={0.04 * (index % 6)}
              inView
            >
              <MagicCard
                className="overflow-hidden h-full flex flex-col"
                gradientSize={250}
                gradientColor="#FFD700"
                gradientOpacity={0.2}
              >
                <HeroVideoDialog
                  animationStyle="from-center"
                  videoSrc={getEmbedUrl(video.youtubeId)}
                  thumbnailSrc={getThumbnailUrl(video.youtubeId)}
                  thumbnailAlt={video.title}
                />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase rounded-full bg-cyber-yellow/10 text-cyber-yellow border border-cyber-yellow/20">
                      {video.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed mb-4 flex-1 line-clamp-3">
                    {video.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {video.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-500 border border-white/10 rounded bg-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                    {video.tags.length > 3 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono text-neutral-600">
                        +{video.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {/* YouTube Channel CTA */}
        <BlurFade delay={0.3} inView>
          <div className="mt-20 text-center">
            <a
              href="https://youtube.com/@kanakdahake"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono font-semibold text-black bg-cyber-yellow rounded-lg hover:bg-cyber-yellow/90 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              View Channel on YouTube
            </a>
          </div>
        </BlurFade>

        {/* Back to Home */}
        <div className="mt-12 text-center">
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
