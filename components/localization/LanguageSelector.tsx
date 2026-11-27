import {deviceLanguage} from '../../lib/localization/client-language';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/router';
import {availableLanguages,hasTranslation,languageOf,languagePath,languageNames,languages,LANGUAGE_PREFERENCE_KEY,type SiteLanguage} from '../../lib/localization/routes';
import {useSiteLanguage} from '../../lib/localization/use-site-language';
export default function LanguageSelector(){
 const router=useRouter(),{language,t}=useSiteLanguage(),available=availableLanguages(router.asPath);
 const [suggest,setSuggest]=useState<SiteLanguage|null>(null);
 useEffect(()=>{let saved:string|null=null;try{saved=localStorage.getItem(LANGUAGE_PREFERENCE_KEY);}catch{}const preferred=deviceLanguage(navigator.languages?.[0]||navigator.language||'en');const hasChoice=!!saved&&languages.includes(saved as SiteLanguage);setSuggest(!hasChoice&&language==='en'&&preferred!=='en'&&languages.includes(preferred)&&hasTranslation(router.asPath,preferred)?preferred:null);},[router.asPath,language]);
 function choose(next:SiteLanguage){try{localStorage.setItem(LANGUAGE_PREFERENCE_KEY,next);}catch{}setSuggest(null);const target=languagePath(router.asPath,next);if(target!==router.asPath)void router.push(target);}
 return <div className="language-selector"><label><span className="sr-language">{t('Language')}</span><select aria-label={t('Website language')} value={language} onChange={e=>choose(e.target.value as SiteLanguage)}>{available.map(l=><option key={l} value={l}>{languageNames[l]}</option>)}</select></label>
 {suggest&&<div className="language-suggestion" role="status"><span>{languageNames[suggest]}?</span><button onClick={()=>choose(suggest)}>{languageNames[suggest]}</button><button aria-label="Keep English" onClick={()=>choose('en')}>English</button></div>}
  <style jsx>{`.language-selector{position:relative;flex-shrink:0}.language-selector select{font:inherit;font-size:12px;background:#111c30;color:#f1f5ff;border:1px solid #40506a;border-radius:8px;padding:8px 5px;max-width:94px;cursor:pointer}.language-selector select:focus-visible{outline:2px solid #bca7ff;outline-offset:3px}.sr-language{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}.language-suggestion{position:absolute;right:0;top:44px;width:245px;display:flex;flex-wrap:wrap;gap:10px;padding:16px;background:#14213a;color:white;border:1px solid #4a5a76;border-radius:12px;box-shadow:0 12px 32px #0008;z-index:100}.language-suggestion span{width:100%;font-size:15px}.language-suggestion button{font:inherit;font-size:13px;border:1px solid #64748b;background:#263654;color:white;border-radius:7px;padding:7px;cursor:pointer}@media(max-width:420px){.language-selector select{max-width:78px;font-size:11px}}`}</style>
 </div>;
}
