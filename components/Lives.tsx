import Image from "next/image";

interface LivesProps {
  remainingLives: number;
  maxLives: number;
}

function Lives({ remainingLives, maxLives }: LivesProps) {
  console.log(
    `Rendering Lives: remainingLives=${remainingLives}, maxLives=${maxLives}`
  );
  return (
    <div
      className={"flex items-center gap-2"}
      style={{ imageRendering: "pixelated" }}
    >
      {new Array(maxLives)
        .fill(null)
        .map((_, i) => {
          const isFullHeart = remainingLives - i > 0;
          const src = isFullHeart ? "/heart-full.png" : "/heart-empty.png";
          return <Image key={i} src={src} alt="Heart" width={32} height={32} />;
        })
        .reverse()}
    </div>
  );
}

export default Lives;
