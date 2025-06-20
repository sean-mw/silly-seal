import Image from "next/image";

function Seal() {
  return (
    <Image
      src="/seal.png"
      alt="Pixelated seal"
      style={{ width: "100%", height: "auto" }}
      width={1024}
      height={1024}
    />
  );
}

export default Seal;
