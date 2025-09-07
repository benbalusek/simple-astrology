"use client";

import AstrologySigns from "@/components/AstrologySigns";
import Button from "@/components/Button";
import DateSelector from "@/components/DateSelector";
import LocationSelector from "@/components/LocationSelector";
import Logo from "@/components/Logo";
import { type PlanetRow } from "@/types/astro";
import { getTimezoneOffset } from "@/utils/timezone";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";

export default function HomePage() {
  type ApiPlanet = {
    planet?: {
      en?: string;
    };
    zodiac_sign?: {
      name?: {
        en?: string;
      };
    };
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockNotice, setBlockNotice] = useState<string | null>(null);

  const [planets, setPlanets] = useState<PlanetRow[]>([]);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [location, setLocation] = useState<[number, number]>([
    -74.0242, 40.6941,
  ]);
  const [lastDate, setLastDate] = useState<Dayjs | null>(null);
  const [lastLoc, setLastLoc] = useState<[number, number] | null>(null);

  const dateChanged = useMemo(() => {
    if (!lastDate || !date) return true; // before first submit, allow
    return date.valueOf() !== lastDate.valueOf(); // compare ms
  }, [date, lastDate]);

  const locChanged = useMemo(() => {
    if (!lastLoc) return true;
    return lastLoc[0] !== location[0] || lastLoc[1] !== location[1];
  }, [location, lastLoc]);

  const canCalculate = !!date && (dateChanged || locChanged) && !loading;

  useEffect(() => {
    setBlockNotice(null);
    setError(null);
  }, [date, location]);

  const handleCalculate = async () => {
    if (!date || !canCalculate) {
      setBlockNotice(
        lastDate && lastLoc
          ? "please change the date or location"
          : "please select a date and location",
      );
      return;
    }

    const [lng, lat] = location;
    const { offset } = getTimezoneOffset(lat, lng, date.toDate());

    const payload = {
      year: date.year(),
      month: date.month() + 1,
      date: date.date(),
      hours: date.hour(),
      minutes: date.minute(),
      seconds: 0,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      timezone: offset,
      config: {
        ayanamsha: "tropical",
        observation_point: "topocentric",
        language: "en",
      },
    };

    setLoading(true);
    setError(null);
    setBlockNotice(null);

    try {
      const res = await fetch("/api/planets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API error", res.status, text);
        return;
      }

      const data = await res.json();

      const majorPlanets = [
        "Sun",
        "Moon",
        "Mars",
        "Mercury",
        "Jupiter",
        "Venus",
        "Saturn",
        "Uranus",
        "Neptune",
      ];

      const items = Array.isArray(data) ? data : (data.output ?? []);
      const simplifiedPlanets: PlanetRow[] = items
        .map((item: ApiPlanet) => ({
          planet: item.planet?.en ?? "Unknown",
          sign: item.zodiac_sign?.name?.en ?? "Unknown",
        }))
        .filter((row: PlanetRow) => majorPlanets.includes(row.planet));

      console.log(simplifiedPlanets);
      setPlanets(simplifiedPlanets);
      setLastDate(date);
      setLastLoc(location);
    } catch (e) {
      console.log(e);
      setError("Could not fetch planets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Logo />
      <DateSelector value={date} onChange={setDate} />
      <LocationSelector value={location} onChange={setLocation} />
      <Button onClick={handleCalculate} isLoading={loading} />
      {(error || blockNotice) && (
        <p className="text-rose mt-4 text-center text-sm">
          {error ?? blockNotice}
        </p>
      )}
      <AstrologySigns planets={planets} />
    </>
  );
}
