export const SITE = "https://www.stockstobuynow.ai";
export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
export function isoDate(value: number | null | undefined) {
  if (!value || !Number.isFinite(value)) return null;
  const d = new Date(value < 1e12 ? value * 1000 : value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
export function displayDate(value: number | null | undefined) {
  const iso = isoDate(value);
  return iso
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(iso))
    : "Date unavailable";
}
export function breadcrumbs(entries: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name,
      item: SITE + e.path,
    })),
  };
}
