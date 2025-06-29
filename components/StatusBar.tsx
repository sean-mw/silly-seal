"use client";

import { useEffect, useState } from "react";
import Button from "./Button";

type StatusBarProps = {
  title: string;
  percent: number;
  buttonLabel: string;
  onClick: () => void;
};

function StatusBar({ title, percent, buttonLabel, onClick }: StatusBarProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // TODO: find better way to handle SSR
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  let color = "#8ac926";
  if (percent < 0.33) {
    color = "#ff595e";
  } else if (percent < 0.66) {
    color = "#ffca3a";
  }

  return (
    <div className="flex flex-col border-t-3 border-black p-2 text-left">
      <div className="text-black text-sm font-semibold mb-1">{title}</div>
      <div className="flex flex-row gap-2">
        <div className="flex-1 border-3 border-black h-10 rounded">
          <div
            className="h-full transition-all duration-300"
            style={{
              backgroundColor: color,
              width: `${percent * 100}%`,
            }}
          />
        </div>
        <Button className="w-24 h-10" onClick={onClick}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}

export default StatusBar;
