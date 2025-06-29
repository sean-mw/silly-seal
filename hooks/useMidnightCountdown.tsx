"use client";

import { useEffect, useState } from "react";

function getNextMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

export function useCountdownToMidnight() {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getNextMidnight() - Date.now());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
