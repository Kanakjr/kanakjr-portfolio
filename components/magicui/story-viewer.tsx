"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type {
  InstagramHighlight,
  InstagramHighlightItem,
} from "@/lib/instagram";

interface StoryViewerProps {
  highlight: InstagramHighlight | null;
  username?: string;
  onClose: () => void;
}

const IMAGE_DURATION_MS = 5000;

export function StoryViewer({
  highlight,
  username,
  onClose,
}: StoryViewerProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!highlight) return;
    setCurrentIndex(0);
    setProgress(0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [highlight]);

  const items: InstagramHighlightItem[] = highlight?.items ?? [];
  const currentItem = items[currentIndex];

  const goNext = useCallback(() => {
    setProgress(0);
    setCurrentIndex((i) => {
      if (i + 1 >= items.length) {
        onClose();
        return i;
      }
      return i + 1;
    });
  }, [items.length, onClose]);

  const goPrev = useCallback(() => {
    setProgress(0);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  // Auto-advance for image items via rAF.
  useEffect(() => {
    if (!highlight || !currentItem) return;
    if (currentItem.type === "video") return;

    const total =
      currentItem.duration && currentItem.duration > 0
        ? currentItem.duration * 1000
        : IMAGE_DURATION_MS;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(1, elapsed / total);
      setProgress(p);
      if (p >= 1) {
        goNext();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [highlight, currentItem, goNext]);

  // For video items, drive the progress bar from the <video> element.
  useEffect(() => {
    if (!currentItem || currentItem.type !== "video") return;
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => {
      if (!v.duration || !isFinite(v.duration)) return;
      setProgress(Math.min(1, v.currentTime / v.duration));
    };
    v.addEventListener("timeupdate", onTimeUpdate);
    return () => v.removeEventListener("timeupdate", onTimeUpdate);
  }, [currentItem]);

  useEffect(() => {
    if (!highlight) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [highlight, onClose, goNext, goPrev]);

  if (!mounted) return null;

  const modal = (
    <AnimatePresence>
      {highlight && currentItem && (
        <motion.div
          key="story-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key={highlight.id}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col md:h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-x-2 top-2 z-20 flex gap-1">
              {items.map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <div
                    className="h-full bg-white"
                    style={{
                      width: `${
                        i < currentIndex
                          ? 100
                          : i === currentIndex
                            ? progress * 100
                            : 0
                      }%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="absolute inset-x-0 top-5 z-20 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={highlight.cover}
                  alt=""
                  className="size-9 rounded-full border border-white/30 object-cover"
                />
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-sm font-semibold text-white">
                    {username ? `@${username}` : "Highlights"}
                  </span>
                  <span className="text-xs text-white/70">
                    {highlight.title}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-black/40 p-1.5 text-white transition-colors hover:bg-black/60"
                aria-label="Close stories"
              >
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="absolute inset-0 overflow-hidden bg-black md:rounded-2xl">
              {currentItem.type === "video" ? (
                <video
                  ref={videoRef}
                  key={currentItem.src}
                  src={currentItem.src}
                  poster={currentItem.poster ?? undefined}
                  autoPlay
                  playsInline
                  controls={false}
                  onEnded={goNext}
                  onError={goNext}
                  className="h-full w-full object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={currentItem.src}
                  src={currentItem.src}
                  alt={highlight.title}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <button
              type="button"
              aria-label="Previous story"
              onClick={goPrev}
              className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-pointer focus:outline-none"
            />
            <button
              type="button"
              aria-label="Next story"
              onClick={goNext}
              className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-pointer focus:outline-none"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}

export default StoryViewer;
