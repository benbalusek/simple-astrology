import astrologyLogo from "@/public/astrology-logo.png";
import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center">
      <Image
        src={astrologyLogo}
        width={1536}
        height={1024}
        alt="Simple Astrology logo"
        className="h-auto w-150"
        placeholder="blur"
        priority
      />
    </div>
  );
}
