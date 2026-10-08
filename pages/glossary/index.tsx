import Link from "next/link";
import ResearchPage from "../../components/ResearchPage";
import terms from "../../data/glossary.json";
export default function Glossary() {
  return (
    <ResearchPage
      title="Investing glossary: understand stock research"
      path="/glossary"
    >
      <div className="public-copy">
        <h1>Investing glossary</h1>
        <p>
          Plain-language explanations for reading company reports and evaluating
          stock ideas.
        </p>
        {terms.map((t) => (
          <section key={t.slug}>
            <h2>
              <Link href={`/glossary/${t.slug}`}>{t.title}</Link>
            </h2>
            <p>{t.definition}</p>
          </section>
        ))}
      </div>
    </ResearchPage>
  );
}
