import Head from 'next/head';
import Header from '../../../components/layout/Header';
import InvestorTracker from '../../../components/InvestorTracker';
import {SITE} from '../../../lib/seo';
export default function InvestorDirectory(){return <><Head><title>Investor Tracker: fund holdings and politician disclosures</title><meta name="description" content="Explore public investor filings, reported fund holdings and politician transactions. View history and save portfolio images without signing in."/><link rel="canonical" href={SITE+'/smart-money/investors/'}/></Head><Header/><main style={{maxWidth:1200,margin:'0 auto',padding:'150px 24px 60px'}}><h1>Investor Tracker</h1><InvestorTracker/></main></>;}
