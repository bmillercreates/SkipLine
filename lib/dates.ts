// Dates are "YYYY-MM-DD" strings for the venue's time zone (not the server's,
// which is UTC on Vercel). Change the zone with NEXT_PUBLIC_APP_TIME_ZONE.
export const APP_TIME_ZONE = process.env.NEXT_PUBLIC_APP_TIME_ZONE || "America/Chicago";

export function dateStr(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIME_ZONE }).format(d);
}

export function parseDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: string, days: number) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// The UTC instant when the clock in APP_TIME_ZONE reads date + hour:00.
function zonedTime(date: string, hour: number) {
  const [y, m, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, hour);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).formatToParts(new Date(guess));
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  const shown = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return new Date(guess - (shown - guess));
}

// A pass for a given night expires at 4:00 AM the next morning.
export function expiresAtFor(date: string) {
  return zonedTime(addDays(date, 1), 4);
}

export function formatDateTime(d: Date, opts: Intl.DateTimeFormatOptions) {
  return d.toLocaleString("en-US", { timeZone: APP_TIME_ZONE, ...opts });
}

export function dateLabel(date: string) {
  const d = parseDate(date);
  const short = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (date === dateStr()) return `Today, ${short}`;
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  return `${weekday}, ${short}`;
}
