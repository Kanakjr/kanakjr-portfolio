"use client";

import Image from "next/image";
import Link from "next/link";
import MagicCard from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { galleryData } from "@/lib/gallery";

const PREVIEW_COUNT = 3;

export default function Portfolio() {
  return (
    <section className="relative py-20 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <BlurFade delay={0.1} inView>
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-white font-mono md:text-5xl mb-4">
              Photo <span className="text-cyber-yellow">Gallery</span>
            </h2>
            <p className="text-neutral-400 text-lg">
              Beyond code -- bikes, builds, and things I make with my hands
            </p>
          </div>
        </BlurFade>

        {/* Compact preview grid -- one row per section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {galleryData.map((section, sectionIndex) => (
            <BlurFade key={section.id} delay={0.1 + sectionIndex * 0.1} inView>
              <Link href="/clicks" className="group block">
                <MagicCard
                  className="p-5 transition-transform duration-300 hover:scale-[1.02]"
                  gradientSize={300}
                  gradientColor="#FFD700"
                  gradientOpacity={0.3}
                >
                  {/* Section label */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white font-mono group-hover:text-cyber-yellow transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-cyber-yellow/60 font-mono text-xs tracking-wider uppercase">
                        {section.accent}
                      </p>
                    </div>
                    <span className="text-neutral-500 group-hover:text-cyber-yellow transition-colors font-mono text-xs">
                      {section.images.length} photos
                    </span>
                  </div>

                  {/* Mini image collage */}
                  <div className="grid grid-cols-3 gap-2">
                    {section.images.slice(0, PREVIEW_COUNT).map((image) => (
                      <div
                        key={image.src}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image.thumb}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 768px) 30vw, 15vw"
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
          <div className="text-center">
            <Link
              href="/clicks"
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
