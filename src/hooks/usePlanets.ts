"use client";

import { type PlanetRow } from "@/types/astro";
import { getTimezoneOffset } from "@/utils/timezone";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

type ApiPlanet = {
  planet?: { en?: string };
  zodiac_sign?: { name?: { en?: string } };
};

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

export default function usePlanets() {
  const [planets, setPlanets] = useState<PlanetRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockNotice, setBlockNotice] = useState<string | null>(null);

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [location, setLocation] = useState<[number, number]>([
    -74.0242, 40.6941,
  ]);
  const [lastDate, setLastDate] = useState<Dayjs | null>(null);
  const [lastLoc, setLastLoc] = useState<[number, number] | null>(null);

  const canCalculate = useMemo(() => {
    if (!date || !location) return false;
    const dateChanged = !lastDate || date.valueOf() !== lastDate.valueOf();
    const locChanged =
      !lastLoc || lastLoc[0] !== location[0] || lastLoc[1] !== location[1];
    return (dateChanged || locChanged) && !loading;
  }, [date, location, lastDate, lastLoc, loading]);

  const calculate = async () => {
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

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.output ?? []);

      const simplifiedPlanets: PlanetRow[] = items
        .map((item: ApiPlanet) => ({
          planet: item.planet?.en ?? "Unknown",
          sign: item.zodiac_sign?.name?.en ?? "Unknown",
        }))
        .filter((row: PlanetRow) => majorPlanets.includes(row.planet));

      setPlanets(simplifiedPlanets);
      setLastDate(date);
      setLastLoc(location);
      return true;
    } catch (e) {
      console.log(e);
      setError("Could not fetch planets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
