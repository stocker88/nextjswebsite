import Head from 'next/head';
import type {ReactNode} from 'react';
import Header from './layout/Header';
import Footer from './layout/Footer';
import {SITE, jsonLd} from '../lib/seo';
import styles from '../styles/PublicEducation.module.css';

export default function PublicEducationPage({title, description, path, image = '/assets/images/aness.jpg', schema, children}: {
  title: string; description: string; path: string; image?: string; schema?: unknown; children: ReactNode;
}) {
  const picture = image.startsWith('https://') ? image : SITE + image;
  return <div className={styles.page}>
    <Head>
      <title>{`${title} | Stocks To Buy Now AI`}</title>
      <meta name="description" content={description}/>
      <link rel="canonical" href={SITE + path}/>
      <meta name="robots" content="index,follow,max-image-preview:large,max-video-preview:-1,max-snippet:-1"/>
      <meta property="og:title" content={title}/><meta property="og:description" content={description}/>
      <meta property="og:url" content={SITE + path}/><meta property="og:type" content="website"/>
      <meta property="og:image" content={picture}/><meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={title}/><meta name="twitter:description" content={description}/><meta name="twitter:image" content={picture}/>
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLd(schema)}}/> : null}
    </Head>
    <Header forceDark navBasePath="/"/>
    <main className={styles.main}>{children}</main>
    <Footer/>
  </div>;
}
