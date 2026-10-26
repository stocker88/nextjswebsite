import { Html, Head, Main, NextScript } from 'next/document'
import {SITE_ACCOUNT_HINT_KEY,SITE_ACCOUNT_HINT_TTL} from '../lib/site-account-hint'

const accountFirstPaint=`(function(){try{var h=JSON.parse(localStorage.getItem(${JSON.stringify(SITE_ACCOUNT_HINT_KEY)})||'null'),n=Date.now();if(h&&h.signedIn===true&&Number.isFinite(h.updatedAt)&&n>=h.updatedAt&&n-h.updatedAt<=${SITE_ACCOUNT_HINT_TTL}){var r=document.documentElement,m=String(h.name||'My account').replace(/[\\u0000-\\u001f\\u007f]/g,' ').trim().slice(0,60)||'My account',i=m.split(/\\s+/).filter(Boolean).slice(0,2).map(function(p){return p.charAt(0)}).join('').toUpperCase().slice(0,2)||'A';r.setAttribute('data-site-account','signed-in');r.style.setProperty('--site-account-name',JSON.stringify(m));r.style.setProperty('--site-account-initials',JSON.stringify(i));}}catch(e){}})();`;

export default function Document() {
  return (
    <Html lang="en" >
      <Head><script dangerouslySetInnerHTML={{__html:accountFirstPaint}} /></Head>
         <body style={{ background: "#121212" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
