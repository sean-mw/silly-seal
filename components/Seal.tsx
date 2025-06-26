import Image from "next/image";

type SealProps = {
  size: number;
};

export default function Seal({ size }: SealProps) {
  return (
    <div
      className="relative border-3 border-black rounded overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <Image
        src="/seal.png"
        alt="Pixelated seal"
        fill
        className="object-cover"
      />
    </div>
  );
}
