import type {Auth} from 'firebase/auth';
let pending:Promise<Auth>|undefined;
export function getSiteAuth():Promise<Auth>{
 if(typeof window==='undefined')return Promise.reject(new Error('Sign-in is available in the browser.'));
 if(!pending)pending=Promise.all([import('firebase/app'),import('firebase/auth')]).then(([app,auth])=>{
  const existing=app.getApps().find(item=>item.name==='website-account');
  const instance=existing||app.initializeApp({apiKey:'AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU',authDomain:process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN||'auth.stockstobuynow.ai',projectId:'stocker-fcda2',appId:'1:269261832880:web:4b6affd899a01f5f0cf175'},'website-account');
  return auth.getAuth(instance);
 }).catch(error=>{pending=undefined;throw error});
 return pending;
}
// Only continue to destinations owned by this flow; never redirect to external input.
export function accountDestination(value:unknown):string{
 if(typeof value!=='string')return '/stock-market-heatmap/';
 if(['/continue','/results','/account','/membership','/market-news','/stock-market-heatmap'].includes(value))value+='/';
 if(/^\/(?:results|stock-market-news|market-news|posts|research|catalysts|stock-movers|news\/briefings|news)\/[a-z0-9][a-z0-9._-]*$/i.test(value)&&!value.includes('..'))value+='/';
 if(value==='/continue/'||value==='/results/'||value==='/account/'||value==='/membership/'||value==='/market-news/'||value==='/stock-market-heatmap/')return value;
 // Preserve article/result destinations without allowing arbitrary redirect URLs.
 if(/^\/(?:results|stock-market-news|market-news|posts|research|catalysts|stock-movers|news\/briefings|news)\/[a-z0-9][a-z0-9._-]*\/$/i.test(value)&&!value.includes('..'))return value;
 return '/stock-market-heatmap/';
}
export function accountLoginUrl(destination:string):string{
 return '/login/?next='+encodeURIComponent(accountDestination(destination));
}
