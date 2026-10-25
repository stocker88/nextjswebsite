import Head from 'next/head';
import {useEffect} from 'react';
import {websiteResearchPath} from '../../../lib/legacy-web-app';
import {catalog} from '../../../lib/catalog';
export default function RetiredFinancial({ticker}: {ticker?:string}) {
 const destination = ticker ? websiteResearchPath(ticker) : '/stocks/';
 useEffect(() => { if(ticker) window.location.replace(destination); }, [ticker,destination]);
 return <><Head><title>Company research has moved</title><meta name="robots" content="noindex"/><link rel="canonical" href={`https://www.stockstobuynow.ai${destination}`}/></Head><a href={destination}>Continue to company research →</a></>;
}
export function getStaticPaths(){return {paths:catalog.map(item=>({params:{ticker:item.symbol}})),fallback: true,};}
export function getStaticProps({params}:any){return {props:{ticker:params.ticker}};}
