/** Identify the device rather than treating every narrow desktop window as a phone. */
export function isDesktopDevice(nav:Pick<Navigator,'userAgent'|'platform'|'maxTouchPoints'>&{userAgentData?:{mobile?:boolean}}):boolean{
 if(nav.userAgentData?.mobile||/Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(nav.userAgent))return false;
 if(nav.platform==='MacIntel'&&nav.maxTouchPoints>1)return false;
 return true;
}
export function isAppDestination(raw:string,origin:string):boolean{
 try{const url=new URL(raw,origin);
  return (url.hostname==='apps.apple.com'&&/\/id1565527320(?:$|\/)/.test(url.pathname))||
   (url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'&&url.searchParams.get('id')==='com.newcompany.stocker')||
   ['com.newcompany.stocker:','ai.stockstobuynow:'].includes(url.protocol)||
   (['applink.stockstobuynow.ai','applink.hellostocker.com','newcompany.page.link'].includes(url.hostname))||
   (url.origin===origin&&url.pathname.replace(/\/$/,'')==='/insight_details_page');
 }catch{return false}
}
