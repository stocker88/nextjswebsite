import Head from 'next/head';
import Link from 'next/link';
import type {ReactNode} from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import {SITE} from '../lib/seo';
import s from '../styles/Legal.module.css';
export default function LegalLayout({title,description,path,children}:{title:string;description:string;path:string;children:ReactNode}){
 return <><Head><title>{title} | Stocks to Buy Now Research</title><meta name="description" content={description}/><meta name="robots" content="noindex,nofollow"/><link rel="canonical" href={SITE+path}/></Head><Header forceDark navBasePath="/"/><main className={s.page}><nav className={s.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/legal/">Legal &amp; Disclosures</Link></nav><aside className={s.draft}><strong>Draft for review</strong><p>These pages are draft disclosures and have not been adopted as company policy. Items requiring confirmation are identified below. Existing terms remain in effect.</p></aside>{children}</main><Footer/></>;
}
