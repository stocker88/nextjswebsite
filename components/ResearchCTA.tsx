import { trackAppStoreClick } from "../lib/analytics";
export default function ResearchCTA({
  placement = "public_research",
}: {
  placement?: string;
}) {
  return (
    <aside className="research-card">
      <h2>Continue your research in the app</h2>
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
    </aside>
  );
}
