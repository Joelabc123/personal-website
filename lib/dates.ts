/** Formats a "YYYY-MM" (or full ISO) date string as a localized "MMM YYYY" label, e.g. "Okt 2026" / "Oct 2026". */
export function formatMonthYear(date: string, locale: string): string {
  const [year, month] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, (month ?? 1) - 1, 1));
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

/** Formats a date range for CV entries, e.g. "03/2025 – Present" -> "Mär 2025 – Heute". */
export function formatDateRange(
  from: string,
  to: string | null,
  locale: string,
  presentLabel: string
): string {
  const start = formatMonthYear(from, locale);
  const end = to ? formatMonthYear(to, locale) : presentLabel;
  return `${start} – ${end}`;
}
