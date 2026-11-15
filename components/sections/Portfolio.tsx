"use client";

import Image from "next/image";
import Link from "next/link";
import MagicCard from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { galleryData } from "@/lib/gallery";

const PREVIEW_COUNT = 3;

export default function Portfolio() {
  return (
    <section id="portfolio" className="relative py-14 px-4 md:py-20">
      <div className="mx-auto max-w-6xl 2xl:max-w-7xl">
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <div className="mb-10 flex flex-col gap-2 md:mb-12">
            <h2 className="font-mono text-3xl font-bold text-white md:text-5xl">
              <span className="text-cyber-yellow">Stills</span>
            </h2>
            <p className="text-neutral-400 md:text-lg">
              Beyond code -- bikes, builds, and things I make with my hands
            </p>
          </div>
        </BlurFade>

        {/* Compact preview grid -- all sections in one row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
          {galleryData.map((section, sectionIndex) => (
            <BlurFade key={section.id} delay={0.1 + sectionIndex * 0.1} inView>
              <Link
                href={`/stills#${section.id === "3d_prints" ? "3d-prints" : section.id}`}
                className="group block"
              >
                <MagicCard
                  className="p-4"
                  gradientSize={250}
                  gradientColor="#FFD700"
                  gradientOpacity={0.3}
                >
                  {/* Section label */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-base font-bold text-white font-mono group-hover:text-cyber-yellow transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-cyber-yellow/60 font-mono text-[10px] tracking-wider uppercase">
                        {section.accent}
                      </p>
                    </div>
                    <span className="text-neutral-500 group-hover:text-cyber-yellow transition-colors font-mono text-xs">
                      {section.images.length}
                    </span>
                  </div>

                  {/* Mini image collage */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {section.images.slice(0, PREVIEW_COUNT).map((image) => (
                      <div
                        key={image.src}
                        className="relative aspect-square rounded-md overflow-hidden"
                      >
                        <Image
                          src={image.thumb}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 30vw, (max-width: 1024px) 15vw, 8vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </MagicCard>
              </Link>
            </BlurFade>
          ))}
        </div>

        {/* View all link */}
        <BlurFade delay={0.3} inView>
          <div>
            <Link
              href="/stills"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-cyber-yellow/10 border border-white/10 hover:border-cyber-yellow/50 rounded-lg text-white hover:text-cyber-yellow transition-all font-mono text-sm"
            >
              View Full Gallery
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
        </BlurFade>
      </div>
    </section>
  );
}
