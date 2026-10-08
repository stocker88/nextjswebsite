import StockResearchDetail from "../../../components/StockResearchDetail";
import { stocks, findStock } from "../../../lib/stocks";
export default function Page({ stock }: { stock: (typeof stocks)[number] }) {
  return <StockResearchDetail stock={stock} mode="earnings" />;
}
export function getStaticPaths() {
  return {
    paths: stocks.map((s) => ({ params: { ticker: s.slug } })),
    fallback: false,
  };
}
export function getStaticProps({ params }: { params: { ticker: string } }) {
  const stock = findStock(params.ticker);
  return stock ? { props: { stock } } : { notFound: true };
}
