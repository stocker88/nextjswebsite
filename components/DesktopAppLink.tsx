import type {AnchorHTMLAttributes,ReactNode} from 'react';
import {useSiteLanguage} from '../lib/localization/use-site-language';
import {useSiteAccount} from './SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import {DESKTOP_ACCESS_PATH,desktopActionLabel,rememberDesktopThread} from '../lib/desktop-access';
export function DesktopActionText({children,desktopLabel}:{children:string;desktopLabel?:string}){
 const {desktop,user}=useSiteAccount();const {t}=useSiteLanguage();const label=desktop?(desktopLabel||desktopActionLabel(children,!!user)):children;return <>{t(label)}</>;
}
export default function DesktopAppLink({href,children,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string;children:ReactNode}){
 const {desktop,user}=useSiteAccount();const {t}=useSiteLanguage();
 const label=typeof children==='string'?(desktop?desktopActionLabel(children,!!user):children):children;
 return <a {...props} href={desktop?(user?DESKTOP_ACCESS_PATH:accountLoginUrl(DESKTOP_ACCESS_PATH)):href}
  target={desktop?undefined:props.target} onClick={event=>{if(desktop){rememberDesktopThread(href);return;}props.onClick?.(event)}}>
  {typeof label==='string'?t(label):label}
 </a>;
}
