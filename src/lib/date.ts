/** Date helpers that work purely on local calendar days (no timezone drift). */

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Build a date with the time set to midnight local time. */
export function day(year: number, month: number, date: number): Date {
  return new Date(year, month, date);
}

export function today(): Date {
  const now = new Date();
  return day(now.getFullYear(), now.getMonth(), now.getDate());
}

export function toKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dd}`;
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return day(y, (m || 1) - 1, d || 1);
}

export function addDays(d: Date, amount: number): Date {
  const copy = day(d.getFullYear(), d.getMonth(), d.getDate());
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function addMonths(d: Date, amount: number): Date {
  return day(d.getFullYear(), d.getMonth() + amount, 1);
}

/** Whole days from `a` to `b` (positive when b is later). */
export function diffDays(a: Date, b: Date): number {
  const A = day(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = day(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((B - A) / 86400000);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toKey(a) === toKey(b);
}

export function startOfMonth(d: Date): Date {
  return day(d.getFullYear(), d.getMonth(), 1);
}

export function daysInMonth(d: Date): number {
  return day(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

/** 6x7 grid of dates covering the given month, starting on Sunday. */
export function monthGrid(d: Date): Date[] {
  const first = startOfMonth(d);
  const offset = first.getDay();
  const start = addDays(first, -offset);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function formatLong(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMedium(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function relativeDays(n: number): string {
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n === -1) return "yesterday";
  if (n > 1) return `in ${n} days`;
  return `${Math.abs(n)} days ago`;
}
