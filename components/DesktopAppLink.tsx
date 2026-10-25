import type {AnchorHTMLAttributes,ReactNode} from 'react';
import {useSiteAccount} from './SiteAccount';
import {accountLoginUrl} from '../lib/site-auth';
import {DESKTOP_ACCESS_PATH,desktopActionLabel,rememberDesktopThread} from '../lib/desktop-access';
export function DesktopActionText({children,desktopLabel}:{children:string;desktopLabel?:string}){
 const {desktop,user}=useSiteAccount();return <>{desktop?(desktopLabel||desktopActionLabel(children,!!user)):children}</>;
}
export default function DesktopAppLink({href,children,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string;children:ReactNode}){
 const {desktop,user}=useSiteAccount();
 return <a {...props} href={desktop?(user?DESKTOP_ACCESS_PATH:accountLoginUrl(DESKTOP_ACCESS_PATH)):href}
  target={desktop?undefined:props.target} onClick={event=>{if(desktop){rememberDesktopThread(href);return;}props.onClick?.(event)}}>
  {desktop&&typeof children==='string'?desktopActionLabel(children,!!user):children}
 </a>;
}
