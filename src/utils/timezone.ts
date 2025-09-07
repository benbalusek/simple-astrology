import tzlookup from "tz-lookup";

type TZNameOption =
  | "short"
  | "long"
  | "shortOffset"
  | "longOffset"
  | "shortGeneric"
  | "longGeneric";

export function getTimezoneOffset(lat: number, lng: number, date: Date) {
  const name = tzlookup(lat, lng);

  const opts: Intl.DateTimeFormatOptions & { timeZoneName?: TZNameOption } = {
    timeZone: name,
    timeZoneName: "shortOffset",
  };

  try {
    const fmt = new Intl.DateTimeFormat("en-US", opts);
    const tzPart = fmt
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value;
    const m = tzPart?.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
    if (m) {
      const hours = Number(m[1]);
      const minutes = m[2] ? Number(m[2]) : 0;
      const offset = hours + minutes / 60;
      return { name, offset };
    }
  } catch (error) {
    console.log(error);
  }

  return computeOffsetByArithmetic(name, date);
}

function computeOffsetByArithmetic(name: string, date: Date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: name,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value]),
  );
  const asUTC = Date.UTC(
    +parts.year,
    +parts.month - 1,
    +parts.day,
    +parts.hour,
    +parts.minute,
    +parts.second,
  );
  const offset = (asUTC - date.getTime()) / 3_600_000;
  return { name, offset };
}
