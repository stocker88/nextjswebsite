import Head from "next/head";
import Link from "next/link";
import ResearchPage from "../../components/ResearchPage";
import terms from "../../data/glossary.json";
import { jsonLd } from "../../lib/seo";
export default function Term({ term }: { term: (typeof terms)[number] }) {
  return (
    <ResearchPage
      title={`${term.title}: definition and investing context`}
      path={`/glossary/${term.slug}`}
      description={term.definition}
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@type": "DefinedTerm",
              name: term.title,
              description: term.definition,
              inDefinedTermSet: "https://www.stockstobuynow.ai/glossary",
            }),
          }}
        />
      </Head>
      <div className="public-copy">
        <h1>{term.title}</h1>
        <p>{term.definition}</p>
        <p>
          Use this concept alongside company disclosures, cash flows and a clear
          investment time horizon. One metric alone does not establish whether
          an investment is suitable.
        </p>
        <p>
          <Link href="/glossary">All definitions</Link> ·{" "}
          <Link href="/stocks">Apply this to company research</Link>
        </p>
      </div>
    </ResearchPage>
  );
}
export function getStaticPaths() {
  return {
    paths: terms.map((t) => ({ params: { term: t.slug } })),
    fallback: false,
  };
}
export function getStaticProps({ params }: { params: { term: string } }) {
  const term = terms.find((t) => t.slug === params.term);
  return term ? { props: { term } } : { notFound: true };
}
