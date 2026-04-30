"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade";

interface LocalVideoDialogProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  className?: string;
  /** Where to send the user if the local video can't be played (e.g. IG permalink). */
  fallbackHref?: string;
  /** Optional caption shown below the video in the modal. */
  caption?: string;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export function LocalVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
  fallbackHref,
  caption,
}: LocalVideoDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errored, setErrored] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const selectedAnimation = animationVariants[animationStyle];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const handlePlayClick = () => {
    if (errored && fallbackHref) {
      window.open(fallbackHref, "_blank", "noopener,noreferrer");
      return;
    }
    setIsOpen(true);
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          onClick={() => setIsOpen(false)}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <motion.div
            {...selectedAnimation}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative mx-4 w-full max-w-md md:mx-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-12 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 ring-white/20 backdrop-blur-md"
              aria-label="Close video"
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
            <div className="relative isolate z-[1] overflow-hidden rounded-2xl border-2 border-cyber-yellow/30 bg-black">
              <video
                ref={videoRef}
                src={videoSrc}
                poster={thumbnailSrc}
                controls
                autoPlay
                playsInline
                className="aspect-[9/16] w-full max-h-[80vh] bg-black"
                onError={() => setErrored(true)}
              />
            </div>
            {caption && (
              <p className="mt-3 max-h-32 overflow-y-auto px-1 text-center text-sm text-neutral-300">
                {caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Play reel"
        className="group relative cursor-pointer border-0 bg-transparent p-0 w-full"
        onClick={handlePlayClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          className="aspect-[9/16] w-full rounded-md border border-white/10 object-cover shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
          onError={() => setErrored(true)}
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="flex size-16 md:size-20 items-center justify-center rounded-full bg-cyber-yellow/10 backdrop-blur-md">
            <div className="relative flex size-12 md:size-14 scale-100 items-center justify-center rounded-full bg-gradient-to-b from-cyber-yellow/30 to-cyber-yellow shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]">
              <svg
                className="size-5 md:size-6 scale-100 fill-black text-black transition-transform duration-200 ease-out group-hover:scale-105"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {mounted && createPortal(modal, document.body)}
    </div>
  );
}

export default LocalVideoDialog;
