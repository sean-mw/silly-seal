"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { applyDecay } from "@/store/sealSlice";

export function SealDecayEffect() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(applyDecay());

    const interval = setInterval(() => {
      dispatch(applyDecay());
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}
