import ResearchPage from '../../components/ResearchPage';
import IndustryExplorer from '../../components/IndustryExplorer';
import {loadIndustryDirectory} from '../../lib/stock-research-server';
import type {IndustrySummary} from '../../lib/peer-analysis';
import styles from '../../styles/PeerAnalysis.module.css';
export default function Industries({industries}:{industries:IndustrySummary[]}){return <ResearchPage title="Industry explorer: companies, P/S and P/E distributions and comparisons" path="/industries/" description="Explore industries, compare companies and inspect saved P/S and P/E distributions and financial metrics."><h1>Industry explorer</h1><div className={styles.section}><IndustryExplorer industries={industries} expanded/></div></ResearchPage>;}
export function getStaticProps(){return {props:{industries:loadIndustryDirectory()},revalidate:300};}
