import Head from 'next/head';
import {useEffect} from 'react';
import {legacyWebAppDestination} from '../../lib/legacy-web-app';
export default function RetiredWebApp() {
 useEffect(() => { window.location.replace(legacyWebAppDestination(window.location.hash)); }, []);
 return <><Head><title>Continue to Stocks To Buy Now AI</title><meta name="robots" content="noindex"/><link rel="canonical" href="https://www.stockstobuynow.ai/"/></Head><main><h1>Everything is now on our website.</h1><a href="/">Continue to Stocks To Buy Now AI →</a></main></>;
}
