"use client";

import { useEffect } from "react";

export function usePreloadImages(urls: (string | undefined)[]) {
  useEffect(() => {
    urls.forEach((src) => {
      if (!src) return;
      const img = new window.Image();
      img.src = src;
    });
  }, [urls]);
}
