import Head from "next/head";
import ResearchPage from "../../components/ResearchPage";
import { jsonLd, SITE } from "../../lib/seo";
export default function Author() {
  return (
    <ResearchPage
      title="Aness Hussein Ali — founder of Stocks To Buy Now AI"
      path="/authors/aness-hussein-ali"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              mainEntity: {
                "@type": "Person",
                name: "Aness Hussein Ali",
                url: SITE + "/authors/aness-hussein-ali",
                sameAs: [
                  "https://anesshusseinali.com/",
                  "https://www.linkedin.com/in/anesshusseinali/",
                ],
              },
            }),
          }}
        />
      </Head>
      <div className="public-copy">
        <h1>Aness Hussein Ali</h1>
        <p>
          Founder of Stocks To Buy Now AI, an app for stock research, market
          insights and investor education.
        </p>
        <p>
          His personal trade examples on this website illustrate selected
          historical outcomes. They do not represent a complete audited track
          record or guarantee future returns.
        </p>
        <p>
          <a href="https://anesshusseinali.com/">Personal website</a> ·{" "}
          <a href="https://www.linkedin.com/in/anesshusseinali/">
            LinkedIn profile
          </a>
        </p>
        <p>
          Authorship and review are credited separately on public articles; this
          profile does not imply that Aness personally authored or reviewed
          every automated preview.
        </p>
      </div>
    </ResearchPage>
  );
}
