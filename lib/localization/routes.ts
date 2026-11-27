/** Languages are advertised only for routes with saved translated content. */
export const languages=['en','es','fr','de','ja','ko'] as const;
export type SiteLanguage=typeof languages[number];
export const languageNames:Record<SiteLanguage,string>={en:'English',es:'Español',de:'Deutsch',fr:'Français',ja:'日本語',ko:'한국어'};
export const conversionRoutes=['/login/','/membership/','/ultra/','/account/','/continue/'] as const;
export const researchRoutes=['/prediction/','/fear-and-greed-index/','/pentagon-pizza-index/'] as const;
export const spanishRoutes=['/','/trading-tools/',...researchRoutes] as const;
export function routePath(value:string){const path=value.split(/[?#]/)[0]||'/';return path==='/'?'/':path.replace(/\/+$/,'')+'/';}
export function languageOf(path:string):SiteLanguage{return (path.match(/^\/(es|de|fr|ja|ko)(?:\/|[?#]|$)/)?.[1] as SiteLanguage)||'en';}
export function englishPath(path:string){const value=path.replace(/^\/(es|de|fr|ja|ko)(?=\/|[?#]|$)/,'');return !value||/^[?#]/.test(value)?'/'+value:value;}
export function hasTranslation(path:string,language:SiteLanguage){
 if(language==='en')return true;
 const plain=routePath(englishPath(path));
 return plain==='/'||(conversionRoutes as readonly string[]).includes(plain)||(language==='es'?(spanishRoutes as readonly string[]):(researchRoutes as readonly string[])).includes(plain)||/^\/prediction\/[^/]+\/(?:today|tomorrow|next-week|next-month|2026|2027|2028|2029|2030)?\/?$/.test(plain);
}
export function hasSpanish(path:string){return hasTranslation(path,'es');}
export function availableLanguages(path:string){return languages.filter(l=>hasTranslation(path,l));}
export function languagePath(path:string,language:SiteLanguage){
 if(!path.startsWith('/')||path.startsWith('//'))return path;
 const english=englishPath(path);
 return language==='en'||!hasTranslation(english,language)?english:'/'+language+english;
}
export const LANGUAGE_PREFERENCE_KEY='site-language-v1';
