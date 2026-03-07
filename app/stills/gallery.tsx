"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MagicCard from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import RetroGrid from "@/components/magicui/retro-grid";
import { galleryData } from "@/lib/gallery";

interface StillsGalleryProps {
  captions: Record<string, string>;
}

export default function StillsGallery({ captions }: StillsGalleryProps) {
  const [lightbox, setLightbox] = useState<{
    sectionIndex: number;
    imageIndex: number;
  } | null>(null);

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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-32">
        <BlurFade delay={0.1} inView>
          <div className="mb-16 text-center">
            <h1 className="text-5xl font-bold text-white font-mono md:text-6xl mb-4">
              <span className="text-cyber-yellow">Stills</span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Beyond code -- bikes, builds, and things I make with my hands
            </p>
            <div className="mt-4 mx-auto w-24 h-0.5 bg-gradient-to-r from-cyber-yellow to-retro-red" />
          </div>
        </BlurFade>

        {galleryData.map((section, sectionIndex) => (
          <div key={section.id} className="mb-24 last:mb-0">
            <BlurFade delay={0.15} inView>
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-mono">
                    {section.title}
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
        ))}

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
