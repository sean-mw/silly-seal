"use client";

import Seal from "@/components/Seal";
import StatusBar from "@/components/StatusBar";
import { useSeal } from "@/hooks/useSeal";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const statusContainerRef = useRef<HTMLDivElement>(null);
  const [sealSize, setSealSize] = useState(512);
  const { sealState } = useSeal();

  useEffect(() => {
    const updateSealSize = () => {
      const statusContainerHeight =
        statusContainerRef.current?.offsetHeight ?? 0;
      const padding = 48;

      const maxHeight = window.innerHeight - statusContainerHeight - padding;
      const maxWidth = window.innerWidth - 32;
      const size = Math.min(maxHeight, maxWidth, 512);

      setSealSize(size);
    };

    updateSealSize();

    const resizeObserver = new ResizeObserver(updateSealSize);
    if (statusContainerRef.current) {
      resizeObserver.observe(statusContainerRef.current);
    }

    window.addEventListener("resize", updateSealSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSealSize);
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-h-screen items-center justify-center gap-4">
      <div className="flex justify-center">
        <Seal size={sealSize} />
      </div>
      <div
        ref={statusContainerRef}
        className="flex flex-col w-full border-b-3 border-x-3 border-black rounded"
      >
        <StatusBar
          title={"Hunger"}
          percent={sealState.hunger / 100}
          buttonLabel={"Feed"}
          onClick={() => {
            router.push("/feed");
          }}
        />
        <StatusBar
          title={"Happiness"}
          percent={sealState.happiness / 100}
          buttonLabel={"Play"}
          onClick={() => {
            router.push("/play");
          }}
        />
        <StatusBar
          title={"Hygiene"}
          percent={sealState.hygiene / 100}
          buttonLabel={"Clean"}
          onClick={() => {
            router.push("/clean");
          }}
        />
      </div>
    </div>
  );
}
