import home from '../../data/localization/home.json';
import conversion from '../../data/localization/conversion.json';
import de from '../../data/localization/de-research.json';
import fr from '../../data/localization/fr-research.json';
import ja from '../../data/localization/ja-research.json';
import ko from '../../data/localization/ko-research.json';
import es from '../../data/localization/es-research.json';
import esUI from '../../data/localization/es-ui.json';
import {spanishText} from './spanish-research';
import type {SiteLanguage} from './routes';
const conversionCatalog=(language:string):Record<string,string>=>Object.fromEntries(Object.entries({...conversion,...home} as Record<string,Record<string,string>>).map(([key,values])=>[key,values[language]]).filter(([,value])=>value!==undefined));
export const catalogs:Record<Exclude<SiteLanguage,'en'>,Record<string,string>>={de:{...de,...conversionCatalog('de')},fr:{...fr,...conversionCatalog('fr')},ja:{...ja,...conversionCatalog('ja')},ko:{...ko,...conversionCatalog('ko')},es:{...esUI,...es,...conversionCatalog('es')}};
const normalize=(s:string)=>s.replace(/\s+/g,' ').trim();
const escape=(s:string)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const templates=Object.entries(catalogs.de).filter(([k])=>/\{\w+\}/.test(k)).map(([key])=>{const names:string[]=[];let source='',offset=0;for(const match of Array.from(key.matchAll(/\{(\w+)\}/g))){source+=escape(key.slice(offset,match.index))+'(.+?)';names.push(match[1]);offset=match.index!+match[0].length;}source+=escape(key.slice(offset));return {key,names,pattern:new RegExp('^'+source+'$')};});
export function translateText(value:string,language:SiteLanguage):string{
 if(language==='en')return value;
 const key=normalize(value),dictionary=catalogs[language];
 const exact=dictionary[key];
 if(exact!==undefined)return value.replace(/\S[\s\S]*\S|\S/,()=>exact);
 const render=(template:string,params:Record<string,string>={})=>{const text=dictionary[template]||template;return text.replace(/\{(\w+)\}/g,(_,name)=>params[name]??'{'+name+'}');};
 const date=key.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2}),? (\d{4})$/);
 if(date){const month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(date[1]);return new Intl.DateTimeFormat(language,{year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(Number(date[3]),month,Number(date[2]))));}
 const recurring=key.split(' · estimated recurring window (not a confirmed date)');
 if(recurring.length===2)return translateText(recurring[0],language)+' · '+translateText('estimated recurring window (not a confirmed date)',language);
 const financial=key.match(/^([A-Z0-9.\-]+) (.+) · reported periods \((.+)\)$/);
 if(financial)return financial[1]+' '+translateText(financial[2],language)+' · '+translateText('reported periods',language)+' ('+translateText(financial[3],language)+')';
 for(const template of templates){const match=key.match(template.pattern);if(match){const params=Object.fromEntries(template.names.map((name,i)=>[name,['period','label','date'].includes(name)?translateText(match[i+1],language):match[i+1]]));return render(template.key,params);}}
 if(language==='es')return spanishText(value);
 const dynamic=key.match(/^Explore the interactive (.+) price chart and (.+) outlook, then compare earnings growth,/);
 if(dynamic)return render('Explore the interactive {symbol} price chart and {period} outlook. Compare earnings growth, valuation and company research. Adjust the controls to compare conditional illustrations, not analyst consensus or guaranteed prices.',{symbol:dynamic[1],period:translateText(dynamic[2],language)});
 if(key.startsWith('A higher share price can already reflect'))return translateText('A higher share price may already reflect strong growth expectations. Earnings growth supports the modeled price; a falling multiple offsets it. Compare revenue, margins, debt and valuation. Assumptions are sensitivity examples, not market expectations.',language);
 const year=key.match(/^By (\d{4}), the result depends/);if(year)return render('By {year}, the result depends on sustained per-share earnings growth and valuation. Even rising earnings can produce a lower price if the multiple falls faster.',{year:year[1]});
 const dated=key.match(/^(.+) · (\d{4}-\d{2}-\d{2})$/);if(dated)return translateText(dated[1],language)+' · '+dated[2];
 return value;
}
export function message(key:string,language:SiteLanguage,params:Record<string,string|number>={}){return translateText(key,language).replace(/\{(\w+)\}/g,(_,name)=>String(params[name]??'{'+name+'}'));}
