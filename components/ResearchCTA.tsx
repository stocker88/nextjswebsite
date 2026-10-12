import { trackAppStoreClick } from "../lib/analytics";
export default function ResearchCTA({
  placement = "public_research",
  variant = "standard",
}: {
  placement?: string;
  variant?: "standard" | "stock";
}) {
  return (
    <aside className={variant === "stock" ? "stock-app-download" : "research-card"} aria-label="Get the app">
      <h2>{variant === "stock" ? "Get the App" : "Continue your research in the app"}</h2>
      <p>
        Explore alerts, company metrics and subscription research. Investing
        involves risk.
      </p>
      {[
        {
          store: "apple" as const,
          label: "Get the iPhone app",
          url: "https://apps.apple.com/us/app/id1565527320",
        },
        {
          store: "google" as const,
          label: "Get the Android app",
          url: "https://play.google.com/store/apps/details?id=com.newcompany.stocker",
        },
      ].map((s) => (
        <a
          className="research-cta"
          key={s.store}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackAppStoreClick({ store: s.store, placement, linkUrl: s.url })
          }
        >
          {s.label} →
        </a>
      ))}
      <style jsx>{`
        .stock-app-download{margin:30px 0;padding:24px;border:1px solid #3b3756;border-radius:16px;background:linear-gradient(120deg,#221c37,#122538);text-align:center}
        .stock-app-download h2{font-size:22px!important;margin:0 0 8px!important;line-height:1.3}
        .stock-app-download p{max-width:520px;margin:0 auto 8px;color:#b9c6dc;font-size:13px;line-height:1.6}
        .stock-app-download a.research-cta{min-height:44px;margin:8px 5px 0;padding:12px 19px;border:1px solid #8270ac;border-radius:10px;background:#bca6ec;color:#171125;font-size:13px;font-weight:600;text-decoration:none}
        .stock-app-download a.research-cta:last-of-type{background:#15273c;color:#c0dcff;border-color:#436082}
        .stock-app-download a:focus-visible{outline:2px solid white;outline-offset:3px}
        @media(max-width:420px){.stock-app-download{padding:20px 12px}.stock-app-download a.research-cta{padding:12px;font-size:12px}}
      `}</style>
    </aside>
  );
}
