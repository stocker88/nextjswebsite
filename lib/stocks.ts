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

