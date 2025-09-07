export const PLANETS = [
  "Sun",
  "Moon",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
] as const;
export type Planet = (typeof PLANETS)[number];

export const ZODIACS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;
export type Zodiac = (typeof ZODIACS)[number];

export type PlanetRow = {
  planet: Planet;
  sign: Zodiac;
};

export function isPlanet(x: string): x is Planet {
  return (PLANETS as readonly string[]).includes(x);
}
export function isZodiac(x: string): x is Zodiac {
  return (ZODIACS as readonly string[]).includes(x);
}
