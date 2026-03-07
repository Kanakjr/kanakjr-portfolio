"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function MatrixRain({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "01アイウエオカキクケコサシスセソタチツテト".split("");
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    let frameCount = 0;
    const maxFrames = 180;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#FFD700";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.5 ? "#FFD700" : "#00FF00";
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      frameCount++;
      if (frameCount >= maxFrames) {
        onComplete();
        return;
      }
      requestAnimationFrame(draw);
    };

    const animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    />
  );
}

export default function EasterEggs() {
  const [konamiTriggered, setKonamiTriggered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const inputRef = useRef<string[]>([]);

  const handleKonamiComplete = useCallback(() => {
    setKonamiTriggered(false);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 4000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      inputRef.current.push(e.key);
      if (inputRef.current.length > KONAMI_CODE.length) {
        inputRef.current.shift();
      }

      if (
        inputRef.current.length === KONAMI_CODE.length &&
        inputRef.current.every((k, i) => k === KONAMI_CODE[i])
      ) {
        inputRef.current = [];
        setKonamiTriggered(true);
      }
    };

    const handleEasterEgg = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "matrix") {
        setKonamiTriggered(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("easter-egg", handleEasterEgg);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("easter-egg", handleEasterEgg);
    };
  }, []);

  return (
    <>
      {konamiTriggered && <MatrixRain onComplete={handleKonamiComplete} />}

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[101] px-6 py-3 rounded-2xl bg-black/90 backdrop-blur-xl border border-cyber-yellow/30 shadow-lg shadow-cyber-yellow/10"
          >
            <p className="text-sm font-mono text-cyber-yellow text-center">
              Achievement Unlocked: Matrix Mode
            </p>
            <p className="text-[11px] text-neutral-400 text-center mt-1">
              You found an Easter egg. There are more hidden around the site.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
