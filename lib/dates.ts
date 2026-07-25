import type { Locale, YearMonth } from "./cv";

function parseYearMonth(value: string): { year: number; month: number } {
  const [year, month = 1] = value.split("-").map(Number);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError(`Invalid year-month value: ${value}`);
  }

  return { year, month };
}

export function formatMonthYear(
  date: string,
  locale: string,
  month: "short" | "long" = "short",
): string {
  const parsed = parseYearMonth(date);
  const value = new Date(Date.UTC(parsed.year, parsed.month - 1, 1));

  return new Intl.DateTimeFormat(locale, {
    month,
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function isFutureYearMonth(date: string, now = new Date()): boolean {
  const parsed = parseYearMonth(date);

  return (
    parsed.year > now.getFullYear() ||
    (parsed.year === now.getFullYear() && parsed.month > now.getMonth() + 1)
  );
}

export type DateRangeLabels = {
  present: string;
  from: string;
};

export function formatDateRange(
  from: YearMonth,
  to: YearMonth | null,
  locale: Locale,
  labels: DateRangeLabels,
  now = new Date(),
): string {
  if (!to && isFutureYearMonth(from, now)) {
    return `${labels.from} ${formatMonthYear(from, locale, "long")}`;
  }

  const start = formatMonthYear(from, locale);
  const end = to ? formatMonthYear(to, locale) : labels.present;

  return `${start} – ${end}`;
}
