export function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCompact(amount: number): string {
  if (amount >= 1_000_000) return `฿${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `฿${(amount / 1_000).toFixed(1)}K`;
  return formatBaht(amount);
}

export function formatDate(yearMonthDay: string): string {
  const y = yearMonthDay.slice(0, 4);
  const m = yearMonthDay.slice(4, 6);
  const d = yearMonthDay.slice(6, 8);
  const date = new Date(`${y}-${m}-${d}T00:00:00Z`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatLastUpdated(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export function toYearMonthDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}