"use client";
import { Planet, PlanetRow, Zodiac } from "@/types/astro";
import { MEANINGS } from "@/types/meanings";
import { useEffect, useRef, useState } from "react";

const P: Record<Planet, string> = {
  Sun: "☉",
  Moon: "☽",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "⛢",
  Neptune: "♆",
};

const Z: Record<Zodiac, string> = {
  Aries: "♈︎",
  Taurus: "♉︎",
  Gemini: "♊︎",
  Cancer: "♋︎",
  Leo: "♌︎",
  Virgo: "♍︎",
  Libra: "♎︎",
  Scorpio: "♏︎",
  Sagittarius: "♐︎",
  Capricorn: "♑︎",
  Aquarius: "♒︎",
  Pisces: "♓︎",
};

export default function AstrologySigns({ planets }: { planets: PlanetRow[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIdx((cur) => (cur === i ? null : i));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div
        ref={containerRef}
        className="my-8 grid grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {planets.map(({ planet, sign }, i) => {
          const isOpen = openIdx === i;
          return (
            <div
              key={planet}
              role="button"
              tabIndex={0}
              aria-pressed={isOpen}
              aria-label={`${planet} in ${sign} — tap to see meaning`}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              className="group border-moon/30 bg-midnight/30 focus-visible:ring-moon/60 relative cursor-pointer rounded-xl border p-4 text-center transition outline-none focus-visible:ring-2"
            >
              <div
                className={`transition ${isOpen ? "opacity-0" : "opacity-100 group-hover:opacity-0"}`}
              >
                <div className="mb-2 text-3xl">{P[planet]}</div>
                <div className="font-semibold">{planet}</div>
                <div className="text-moon/80 mt-1">
                  {Z[sign]} {sign}
                </div>
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-xl px-3 text-sm font-medium transition ${isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"} bg-moon text-midnight`}
              >
                {MEANINGS[planet][sign]}
              </div>
            </div>
          );
        })}
      </div>
      {planets.length ? (
        <p className="text-moon/60 mt-2 text-center text-xs lg:hidden">
          tap a card to see its meaning
        </p>
      ) : null}
    </>
  );
}
