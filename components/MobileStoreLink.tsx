import {useEffect,useState} from 'react';
import menuStyles from '../styles/SiteMenu.module.css';
import {mobileStoreUrl,GOOGLE_STORE_URL} from '../lib/mobile-app';
import {trackAppStoreClick} from '../lib/analytics';
export default function MobileStoreLink({placement,onClick}:{placement:string;onClick?:()=>void}){
 const [href,setHref]=useState(mobileStoreUrl(''));
 useEffect(()=>setHref(mobileStoreUrl(navigator.userAgent)),[]);
 return <a className={placement==='header'?menuStyles.toggle:'nav-cta app-download-cta'} data-public-store-link="true" style={placement==='header'?{display:'inline-flex',textDecoration:'none',whiteSpace:'nowrap'}:undefined} href={href} onClick={()=>{
  try{trackAppStoreClick({store:href===GOOGLE_STORE_URL?'google':'apple',placement,linkUrl:href})}catch{/* Analytics must never block the store. */}
  onClick?.();
 }}>{placement==='header'?<b>Get the app →</b>:'Get the app →'}</a>;
}
