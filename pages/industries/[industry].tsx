import Head from 'next/head';
import Link from 'next/link';
import ResearchPage from '../../components/ResearchPage';
import StockPeerAnalysis from '../../components/StockPeerAnalysis';
import {loadIndustryDirectory,loadIndustryResearch} from '../../lib/stock-research-server';
import {breadcrumbs,jsonLd} from '../../lib/seo';
import type {IndustrySummary,PeerCompany} from '../../lib/peer-analysis';
export default function Industry({industry,industries,companies}:{industry:IndustrySummary;industries:IndustrySummary[];companies:PeerCompany[]}){
 const path='/industries/'+industry.slug+'/';
 return <ResearchPage title={`${industry.name} stocks: peer comparison and P/E distribution`} path={path} description={`Compare ${industry.count} ${industry.name.toLowerCase()} companies by valuation, price changes and financial metrics. Explore the P/E distribution and company research.`} hideAppDownload><Head><script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(breadcrumbs([{name:'Home',path:'/'},{name:'Industries',path:'/industries/'},{name:industry.name,path}]))}}/></Head><p><Link href="/industries/">← All industries</Link></p><h1>{industry.name} stocks</h1><p>Compare the industry’s companies, explore valuation ranges and open individual stock research.</p><StockPeerAnalysis key={industry.slug} industry={industry.name} companies={companies} industries={industries}/></ResearchPage>;
}
export function getStaticPaths(){return {paths:loadIndustryDirectory().map(i=>({params:{industry:i.slug}})),fallback:false};}
export function getStaticProps({params}:{params:{industry:string}}){const result=loadIndustryResearch(params.industry);return result?{props:result,revalidate:300}:{notFound:true};}
