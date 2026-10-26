import type {Auth} from 'firebase/auth';
let pending:Promise<Auth>|undefined;
export function getSiteAuth():Promise<Auth>{
 if(typeof window==='undefined')return Promise.reject(new Error('Sign-in is available in the browser.'));
 if(!pending)pending=Promise.all([import('firebase/app'),import('firebase/auth')]).then(([app,auth])=>{
  const existing=app.getApps().find(item=>item.name==='website-account');
  const instance=existing||app.initializeApp({apiKey:'AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU',authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN||'auth.stockstobuynow.ai',projectId:'stocker-fcda2',storageBucket:'stocker-fcda2.appspot.com',appId:'1:269261832880:web:4b6affd899a01f5f0cf175'},'website-account');
  return auth.getAuth(instance);
 }).catch(error=>{pending=undefined;throw error});
 return pending;
}
// Only continue to destinations owned by this flow; never redirect to external input.
export function accountDestination(value:unknown):string{
 if(typeof value!=='string')return '/stock-market-heatmap/';
 // Smart Money pages are account-gated in the browser, while their static HTML
 // remains available to search engines. Preserve only the supported Signals
 // deep link after sign-in; discard every other query string.
 const smartMoney=value.match(/^\/(smart-money|politician-trades|insider-trades|hedge-fund-activity)\/?(?:\?view=(signals))?$/);
 if(smartMoney)return `/${smartMoney[1]}/${smartMoney[2]?'?view=signals':''}`;
 // Recent headline routes have one bounded ID; preserve it after sign-in.
 const story=value.match(/^\/market-news\/story\/?\?id=([A-Za-z0-9_.%-]{1,240})$/);
 if(story&&!story[1].includes('..'))return '/market-news/story/?id='+story[1];
 if(['/ultra','/continue','/results','/account','/membership','/market-news','/stock-market-heatmap'].includes(value))value+='/';
 if(/^\/(?:results|stock-market-news|market-news|posts|research|catalysts|stock-movers|insider-news|news\/briefings|news)\/[a-z0-9][a-z0-9._-]*$/i.test(value)&&!value.includes('..'))value+='/';
 if(value==='/ultra/'||value==='/continue/'||value==='/results/'||value==='/account/'||value==='/membership/'||value==='/market-news/'||value==='/stock-market-heatmap/')return value;
 // Preserve article/result destinations without allowing arbitrary redirect URLs.
 if(/^\/(?:results|stock-market-news|market-news|posts|research|catalysts|stock-movers|insider-news|news\/briefings|news)\/[a-z0-9][a-z0-9._-]*\/$/i.test(value)&&!value.includes('..'))return value;
 return '/stock-market-heatmap/';
}
export function accountLoginUrl(destination:string):string{
 return '/login/?next='+encodeURIComponent(accountDestination(destination));
}
