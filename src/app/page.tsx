"use client";

import AstrologySigns from "@/components/AstrologySigns";
import Button from "@/components/Button";
import DateSelector from "@/components/DateSelector";
import LocationSelector from "@/components/LocationSelector";
import Logo from "@/components/Logo";
import Notices from "@/components/Notices";
import usePlanets from "@/hooks/usePlanets";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const {
    planets,
    loading,
    error,
    blockNotice,
    setBlockNotice,
    date,
    setDate,
    location,
    setLocation,
    calculate,
  } = usePlanets();

  useEffect(() => {
    if (!date) setDate(dayjs());
    if (!location) setLocation([-74.0242, 40.6941]);
  }, [date, location, setDate, setLocation]);

  const resultsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!planets.length || !resultsRef.current) return;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resultsRef.current!.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }, [planets.length]);

  async function handleCalculate() {
    setBlockNotice(null);
    const ok = await calculate();
    if (ok && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <>
      <Logo />
      <DateSelector value={date} onChange={setDate} />
      <LocationSelector value={location} onChange={setLocation} />
      <Button onClick={handleCalculate} isLoading={loading} />
      <Notices error={error} block={blockNotice} />
      <div ref={resultsRef} className="scroll-mt-24" />
      <AstrologySigns planets={planets} anchorRef={resultsRef} />
    </>
  );
}
