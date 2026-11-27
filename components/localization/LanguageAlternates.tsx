import {useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {SITE} from '../../lib/seo';
import {englishPath,availableLanguages,routePath,languageOf,languagePath} from '../../lib/localization/routes';
export default function LanguageAlternates(){const {asPath}=useRouter();useEffect(()=>{document.documentElement.lang=languageOf(asPath);},[asPath]);const path=routePath(englishPath(asPath)),available=availableLanguages(path);if(available.length<2)return null;return <Head>{available.map(lang=><link key={'alternate-'+lang} rel="alternate" hrefLang={lang} href={SITE+languagePath(path,lang)}/>)}<link key="alternate-default" rel="alternate" hrefLang="x-default" href={SITE+path}/></Head>;}
