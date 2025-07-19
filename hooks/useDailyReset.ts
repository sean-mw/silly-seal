"use client";

import { useEffect } from "react";

export function useDailyReset(createdAt: number, reset: () => void): void {
  useEffect(() => {
    const createdAtDate = new Date(createdAt);
    const nowDate = new Date();
    const createdToday =
      createdAtDate.getFullYear() === nowDate.getFullYear() &&
      createdAtDate.getMonth() === nowDate.getMonth() &&
      createdAtDate.getDate() === nowDate.getDate();
    if (!createdToday) {
      reset();
    }
  }, [createdAt, reset]);
}
