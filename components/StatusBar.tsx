"use client";

import { useEffect, useRef, useState } from "react";
import Button from "./Button";
import { cn } from "@/lib/utils";

const ANIMATION_DURATION = 750;

type StatusBarProps = {
  title: string;
  percent: number;
  prevPercent?: number;
  buttonLabel?: string;
  onClick?: () => void;
  className?: string;
};

function getBarColor(value: number) {
  if (value < 0.33) return "#ff595e";
  if (value < 0.66) return "#ffca3a";
  return "#8ac926";
}

function StatusBar({
  title,
  percent,
  prevPercent = percent,
  buttonLabel,
  onClick,
  className,
}: StatusBarProps) {
  const [animatedPercent, setAnimatedPercent] = useState(prevPercent);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easedProgress = Math.min(progress / ANIMATION_DURATION, 1);
      const newVal = prevPercent + (percent - prevPercent) * easedProgress;
      setAnimatedPercent(newVal);

      if (progress < ANIMATION_DURATION) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedPercent(percent);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [percent, prevPercent]);

  const color = getBarColor(animatedPercent);

  return (
    <div className={cn("flex flex-col p-2 text-left", className)}>
      <div className="text-black text-sm font-semibold mb-1">{title}</div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 border-3 border-black h-10 rounded overflow-hidden">
          <div
            className="h-full transition-none"
            style={{
              backgroundColor: color,
              width: `${animatedPercent * 100}%`,
            }}
          />
        </div>
        {buttonLabel && (
          <Button className="w-24 h-10" onClick={onClick}>
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

export default StatusBar;
