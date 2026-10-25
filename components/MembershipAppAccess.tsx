import {DesktopActionText} from './DesktopAppLink';
import {PRO_WEB_LAUNCH,proLaunchGoogleCalendarUrl} from '../lib/pro-web-launch';
import s from '../styles/Membership.module.css';
export function LaunchCalendarButton(){return <details className={s.calendarMenu}><summary className={s.secondary}>Add to my calendar <span aria-hidden="true">＋</span></summary><div className={s.calendarOptions}><a href={proLaunchGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer">Google Calendar ↗</a><a href="/calendar/pro-web-launch.ics" download="stocks-to-buy-now-pro-web-launch.ics">Apple Calendar / Outlook ↓</a><small>All-day event · December 1, 2026</small></div></details>}
export default function MembershipAppAccess({purchased=false,pro=false,onGetApp}:{purchased?:boolean;pro?:boolean;onGetApp:()=>void}){
 return <section className={`${s.appAccess} ${purchased?s.purchaseWelcome:''}`} aria-label={purchased?'Payment confirmed and Pro access':'Get the app and Pro web launch'}>
  <div className={s.appAccessHeading}><img src="/assets/images/stockerRobotIcon.png" alt="" width="58" height="58"/><span className={s.eyebrow}>{purchased?'PAYMENT CONFIRMED · WELCOME TO PRO':'YOUR ACCOUNT · APP & WEB'}</span></div>
  <h2>{purchased?'You’re Pro. Get started in the app.':pro?'Your Pro membership goes with you.':'Your market, wherever you are.'}</h2>
  <p>{purchased?'Your payment is confirmed. Get the app and sign in with the same account you used here to access Pro.':pro?'Get the app and sign in with the same account you’re using here to access Pro.':'Get the app for iPhone or Android. Already a Pro member? Sign in with the same account to access your membership.'}</p>
  <div className={s.launchNotice}><span className={s.eyebrow}>COMING TO THE WEB</span><h3>Live Pro web launches {PRO_WEB_LAUNCH.label}.</h3><p>Join us for a live video demo. Add the all-day launch reminder to your calendar; the demo time and viewing link will be announced here.</p></div>
  <div className={s.actions}><button className={s.primary} onClick={onGetApp}><DesktopActionText>{'Get the App ↗'}</DesktopActionText></button><LaunchCalendarButton/></div>
  <p className={s.note}>Your membership is linked to your account. Use the same sign-in method in the app.</p>
 </section>;
}
