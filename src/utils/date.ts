export const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const pad = (n: number) => String(n).padStart(2, "0");

// Local YYYY-MM-DD, the format new dates are saved in
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const buildDate = (year: number, month: number, day: number): Date | null => {
  const date = new Date(year, month - 1, day);
  // Rejects things like 02-31 that Date would silently roll over
  return date.getMonth() === month - 1 && date.getDate() === day ? date : null;
};

// Reads both YYYY-MM-DD and the older MM-DD-YYYY records (DD-MM-YYYY when the
// first number can't be a month)
export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;

  const iso = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return buildDate(Number(iso[1]), Number(iso[2]), Number(iso[3]));

  const legacy = value.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (legacy) {
    const [a, b, year] = [
      Number(legacy[1]),
      Number(legacy[2]),
      Number(legacy[3]),
    ];
    return a > 12 ? buildDate(year, b, a) : buildDate(year, a, b);
  }

  return null;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

// Keeps the day when possible, clamps it on shorter months (JAN 31 -> FEB 28)
export function addMonths(date: Date, months: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(date.getDate(), lastDay),
  );
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && toIsoDate(a) === toIsoDate(b);
}

// 6 rows x 7 days, starting on the Sunday before the 1st
export function calendarDays(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}
