import Head from 'next/head';
import Header from '../../../components/layout/Header';
import InvestorTracker from '../../../components/InvestorTracker';
import {publicInvestors,investorPath} from '../../../lib/public-investors';
import type {TrackerDetail} from '../../../lib/investor-tracker';
import {SITE} from '../../../lib/seo';

export default function InvestorPage({initialDetail}:{initialDetail:TrackerDetail}){
 const title=initialDetail.name+(initialDetail.kind==='funds'?' — Reported holdings':' — Reported stock transactions');
 const description=initialDetail.kind==='funds'?'Explore reported fund holdings, filing history and portfolio exports. Filings are not a complete live portfolio.':'Explore published politician stock disclosures and transaction ranges. Disclosures do not establish a complete current portfolio.';
 return <><Head><title>{title} | Investor Tracker</title><meta name="description" content={description}/><link rel="canonical" href={SITE+investorPath(initialDetail.id)}/><meta name="robots" content="index,follow"/></Head><Header/><main style={{maxWidth:1200,margin:'0 auto',padding:'150px 24px 60px'}}><a href="/smart-money/investors/" data-public-content="true">← All investors</a><h1>{title}</h1><p>{description}</p><InvestorTracker key={initialDetail.id} initialDetail={initialDetail}/></main></>;
}
export function getStaticPaths(){return {paths:publicInvestors.map(p=>({params:{investor:p.slug}})),fallback:false};}
export async function getStaticProps({params}:{params:{investor:string}}){
 const profile=publicInvestors.find(p=>p.slug===params.investor);
 if(!profile)return {notFound:true};
 const fs=await import('node:fs/promises');
 const value=JSON.parse(await fs.readFile(process.cwd()+'/public/investor-tracker/'+profile.id+'.json','utf8'));
 return {props:{initialDetail:{...value,following:false}}};
}
