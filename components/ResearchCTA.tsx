import {useSiteAccount} from './SiteAccount';
import DesktopAppLink from './DesktopAppLink';
import AppDownloadOptions from './AppDownloadOptions';
export default function ResearchCTA({placement='public_research',variant='standard'}:{placement?:string;variant?:'standard'|'stock'}){
 const {desktop,user}=useSiteAccount();
 return <aside className="research-access-cta" aria-label={desktop?'Continue your research':'Get the app'}>
  <h2>{desktop?'Continue your research':variant==='stock'?'Get the App':'Continue your research in the app'}</h2>
  <p>{desktop?'Explore signals, market outlooks, alerts and company research with your membership.':'Explore alerts, company metrics and subscription research. Investing involves risk.'}</p>
  {desktop?<DesktopAppLink className="research-cta" href="https://apps.apple.com/us/app/id1565527320">{user?'Access your research →':'Sign Up →'}</DesktopAppLink>:<AppDownloadOptions placement={placement}/>}
  <style jsx>{`.research-access-cta{margin:30px 0;padding:28px;border:1px solid #62517655;border-radius:18px;background:linear-gradient(120deg,#221c37,#122538);text-align:center;color:#f4f0ff}.research-access-cta h2{font-size:24px;margin:0 0 12px}.research-access-cta p{max-width:620px;margin:0 auto;color:#b9c6dc;font-size:14px;line-height:1.65}.research-access-cta :global(.research-cta){display:inline-flex;margin-top:22px;padding:13px 28px;border-radius:999px;background:#c7b2ef;color:#1c1630;font-size:14px;font-weight:650;text-decoration:none}.research-access-cta :global(.research-cta:focus-visible){outline:2px solid white;outline-offset:4px}`}</style>
 </aside>;
}
