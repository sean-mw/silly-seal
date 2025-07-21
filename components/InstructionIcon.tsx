import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export interface InstructionIconProps {
  src?: string;
  alt?: string;
  content?: React.ReactNode;
  className?: string;
}

const SIZE = 32;

const InstructionIcon: React.FC<InstructionIconProps> = ({
  content,
  src,
  alt,
  className,
}) => (
  <span
    className={cn(
      "relative inline-block bg-gray-200 rounded shadow",
      className
    )}
    style={{
      width: SIZE,
      height: SIZE,
    }}
  >
    {src && alt && (
      <Image
        src={src}
        alt={alt}
        width={SIZE}
        height={SIZE}
        draggable={false}
        className="h-full w-full rounded"
        style={{ imageRendering: "pixelated" }}
      />
    )}
    <span
      className="absolute inset-0 flex items-center justify-center font-bold text-lg text-black"
      style={{
        width: SIZE,
        height: SIZE,
      }}
    >
      {content}
    </span>
  </span>
);

export default InstructionIcon;
