"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MagicCard from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import RetroGrid from "@/components/magicui/retro-grid";
import { HighlightsRow } from "@/components/magicui/highlights-row";
import { galleryData } from "@/lib/gallery";
import type { InstagramHighlight } from "@/lib/instagram";

interface StillsGalleryProps {
  captions: Record<string, string>;
  highlights?: InstagramHighlight[];
  instagramUsername?: string;
}

function getSectionSlug(id: string): string {
  if (id === "3d_prints") return "3d-prints";
  return id;
}

export default function StillsGallery({
  captions,
  highlights = [],
  instagramUsername,
}: StillsGalleryProps) {
  const [lightbox, setLightbox] = useState<{
    sectionIndex: number;
    imageIndex: number;
  } | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Smooth scroll to section if URL has a hash on mount or hash change
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const targetId = hash === "3d_prints" ? "3d-prints" : hash;
      const el = document.getElementById(targetId) || document.getElementById(hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleCopyLink = (e: React.MouseEvent, slug: string, title: string) => {
    e.preventDefault();
    const url = `${window.location.origin}/stills#${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedSection(title);
        setTimeout(() => setCopiedSection(null), 2500);
      });
    }
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    window.history.pushState(null, "", `/stills#${slug}`);
  };

  const openLightbox = (sectionIndex: number, imageIndex: number) => {
    setLightbox({ sectionIndex, imageIndex });
  };

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: "prev" | "next") => {
      if (!lightbox) return;
      const section = galleryData[lightbox.sectionIndex];
      const total = section.images.length;
      const newIndex =
        direction === "next"
          ? (lightbox.imageIndex + 1) % total
          : (lightbox.imageIndex - 1 + total) % total;
      setLightbox({ ...lightbox, imageIndex: newIndex });
    },
    [lightbox]
  );

  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateLightbox("next");
      if (e.key === "ArrowLeft") navigateLightbox("prev");
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightbox, closeLightbox, navigateLightbox]);

  const currentImage = lightbox
    ? galleryData[lightbox.sectionIndex].images[lightbox.imageIndex]
    : null;
  const currentCaption = currentImage ? captions[currentImage.src] : null;

  const handleAskJarvis = () => {
    if (!currentImage) return;
    const section = galleryData[lightbox!.sectionIndex];
    const context = currentCaption
      ? `I'm looking at an image from the "${section.title}" gallery: ${currentCaption}`
      : `I'm looking at an image from the "${section.title}" gallery: ${currentImage.alt}`;

    closeLightbox();

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("jarvis-ask", { detail: { message: context, imageSrc: currentImage.src } })
      );
    }, 300);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <RetroGrid className="opacity-30" />

      {/* Copied Feedback Toast */}
      {copiedSection && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 bg-neutral-900/95 border border-cyber-yellow/60 text-white px-4 py-2.5 rounded-lg shadow-2xl font-mono text-xs backdrop-blur-md transition-all">
          <svg className="w-4 h-4 text-cyber-yellow shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>
            Copied link to <span className="text-cyber-yellow font-bold">#{copiedSection}</span>
          </span>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32">
        <BlurFade delay={0.1} inView>
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
              <span className="text-cyber-yellow">Stills</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Beyond code -- bikes, builds, and things I make with my hands
            </p>
            <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
          </div>
        </BlurFade>

        {/* Quick Section Navigation Bar */}
        <BlurFade delay={0.15} inView>
          <nav aria-label="Gallery sections" className="flex flex-wrap items-center justify-center gap-2 mb-16">
            {galleryData.map((sec) => {
              const slug = getSectionSlug(sec.id);
              return (
                <a
                  key={sec.id}
                  href={`#${slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(slug);
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", `/stills#${slug}`);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:text-cyber-yellow hover:border-cyber-yellow/50 hover:bg-cyber-yellow/10 transition-all cursor-pointer"
                >
                  <span>{sec.title}</span>
                  <span className="text-[10px] text-neutral-500 font-normal">
                    {sec.images.length}
                  </span>
                </a>
              );
            })}
          </nav>
        </BlurFade>

        {galleryData.map((section, sectionIndex) => {
          const slug = getSectionSlug(section.id);
          return (
            <div
              key={section.id}
              id={slug}
              className="mb-24 last:mb-0 scroll-mt-28 relative"
            >
              {/* Supporting both #3d-prints and legacy/internal #3d_prints */}
              {slug !== section.id && (
                <span
                  id={section.id}
                  className="block -mt-28 pt-28 pointer-events-none absolute"
                  aria-hidden="true"
                />
              )}

              <BlurFade delay={0.15} inView>
                <div className="mb-10">
                  <div className="flex items-center gap-4 mb-2 group/title">
                    <h2 className="text-3xl md:text-4xl font-bold text-white font-mono">
                      <a
                        href={`#${slug}`}
                        onClick={(e) => handleCopyLink(e, slug, section.title)}
                        className="hover:text-cyber-yellow transition-colors inline-flex items-center gap-2.5 cursor-pointer"
                        title="Click to copy link to this section"
                      >
                        <span>{section.title}</span>
                        <span className="text-cyber-yellow/40 group-hover/title:text-cyber-yellow text-xl md:text-2xl font-normal transition-colors">
                          #
                        </span>
                      </a>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-cyber-yellow/40 to-transparent" />
                  </div>
                  <p className="text-cyber-yellow/80 font-mono text-sm tracking-wider uppercase mb-1">
                    {section.accent}
                  </p>
                  <p className="text-neutral-400 text-base">
                    {section.description}
                  </p>
                </div>
              </BlurFade>

              {section.id === "nerdguytheory" && highlights.length > 0 && (
                <BlurFade delay={0.2} inView>
                  <HighlightsRow
                    highlights={highlights}
                    username={instagramUsername}
                  />
                </BlurFade>
              )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {section.images.map((image, imageIndex) => (
                <BlurFade
                  key={image.src}
                  delay={0.05 * imageIndex}
                  inView
                >
                  <MagicCard
                    className="cursor-pointer overflow-hidden group/img"
                    gradientSize={250}
                    gradientColor="#FFD700"
                    gradientOpacity={0.3}
                  >
                    <div
                      className="relative aspect-square overflow-hidden"
                      onClick={() => openLightbox(sectionIndex, imageIndex)}
                    >
                      <Image
                        src={image.thumb}
                        alt={captions[image.src] || image.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover/img:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white/0 group-hover/img:text-white/90 transition-colors duration-300 font-mono text-sm tracking-wider">
                          View
                        </span>
                      </div>
                    </div>
                  </MagicCard>
                </BlurFade>
              ))}
            </div>
          </div>
        );
      })}

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

      {/* Lightbox Modal */}
      {lightbox && currentImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("prev"); }}
            className="absolute left-4 md:left-8 text-white/70 hover:text-cyber-yellow transition-colors z-10"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            className="relative max-w-[90vw] max-h-[80vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.src}
              alt={captions[currentImage.src] || currentImage.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox("next"); }}
            className="absolute right-4 md:right-8 text-white/70 hover:text-cyber-yellow transition-colors z-10"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Bottom bar: caption + counter + Ask Jarvis */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-6 pt-16 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {currentCaption && (
              <p className="text-sm text-neutral-300 text-center max-w-2xl mx-auto mb-3 leading-relaxed">
                {currentCaption}
              </p>
            )}
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/60 font-mono text-sm">
                {lightbox.imageIndex + 1} / {galleryData[lightbox.sectionIndex].images.length}
              </span>
              <button
                onClick={handleAskJarvis}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow text-xs font-mono hover:bg-cyber-yellow/20 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Ask Jarvis
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
