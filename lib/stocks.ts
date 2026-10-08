import stocks from "../data/stocks.json";
import type { ResearchPreview } from "./research";
export { stocks };
export function findStock(value: string) {
  return stocks.find((s) => s.slug === value.toLowerCase());
}
export function stockNews(items: ResearchPreview[], ticker: string) {
  return items.filter((item) =>
    item.symbols.some((s) => s.replace(/^[#$]/, "").toUpperCase() === ticker),
  );
}

// Use a rolling six-calendar-month window, clamping month-end dates.
export function recentStockNews(items: ResearchPreview[], ticker: string, now = new Date()) {
  const cutoff = new Date(now);
  const day = cutoff.getUTCDate();
  cutoff.setUTCDate(1);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - 6);
  const lastDay = new Date(Date.UTC(cutoff.getUTCFullYear(), cutoff.getUTCMonth() + 1, 0)).getUTCDate();
  cutoff.setUTCDate(Math.min(day, lastDay));
  const timestamp = (value: number | null) => !value || !Number.isFinite(value) ? NaN : value < 1e12 ? value * 1000 : value;
  const recent = Array.from(new Map(stockNews(items, ticker)
    .filter(item => timestamp(item.time) >= cutoff.getTime() && timestamp(item.time) <= now.getTime())
    .map(item => [item.id, item])).values())
    .sort((a, b) => timestamp(b.time) - timestamp(a.time));
  return recent.length >= 5 ? recent.slice(0, 12) : [];
}
