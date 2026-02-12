"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Meteors = ({
  number = 20,
  className,
  opacity = 1,
}: {
  number?: number;
  className?: string;
  opacity?: number;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [meteorStyles, setMeteorStyles] = useState<Array<{
    left: string;
    animationDelay: string;
    animationDuration: string;
  }>>([]);

  useEffect(() => {
    setIsMounted(true);
    const styles = Array.from({ length: number }, () => ({
      left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
      animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
      animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
    }));
    setMeteorStyles(styles);
  }, [number]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={idx}
          className={cn(
            "absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] animate-meteor-effect rounded-[9999px]",
            className
          )}
          style={{
            top: 0,
            left: style.left,
            animationDelay: style.animationDelay,
            animationDuration: style.animationDuration,
            backgroundColor: `rgba(255, 215, 0, ${opacity})`,
            boxShadow: `0 0 0 1px rgba(255, 255, 255, ${opacity * 0.1})`,
          }}
        >
          <span
            className="absolute top-1/2 h-[1px] w-[50px] -translate-y-[50%]"
            style={{
              background: `linear-gradient(to right, rgba(255, 215, 0, ${opacity}), transparent)`,
            }}
          />
        </span>
      ))}
    </>
  );
};
