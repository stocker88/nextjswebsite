import {cloneElement,isValidElement,type ReactNode,type ReactElement} from 'react';
import {useSiteLanguage} from '../../lib/localization/use-site-language';
import {languagePath,type SiteLanguage} from '../../lib/localization/routes';
import {translateText} from '../../lib/localization/translate';
import DesktopAppLink,{DesktopActionText} from '../DesktopAppLink';
const SITE='https://www.stockstobuynow.ai';
function url(value:string,language:SiteLanguage){return value.startsWith(SITE+'/')?SITE+languagePath(value.slice(SITE.length),language):languagePath(value,language)}
function schema(value:any,language:SiteLanguage,key=''):any{
 if(Array.isArray(value))return value.map(v=>schema(v,language,key));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,schema(v,language,k)]));
 if(typeof value!=='string')return value;
 if(key==='inLanguage')return language;
 if(['url','item','@id'].includes(key))return url(value,language);
 return ['name','description','text','headline'].includes(key)?translateText(value,language):value;
}
/** Fixed, server-rendered copy. Never translates market values, IDs, news or API payloads. */
function translate(node:ReactNode,language:SiteLanguage):ReactNode{
 if(typeof node==='string')return translateText(node,language);
 if(Array.isArray(node))return node.map((n,index)=>{const translated=translate(n,language);return isValidElement(translated)&&translated.key==null?cloneElement(translated,{key:'localized-'+index}):translated;});
 if(!isValidElement(node))return node;
 const element=node as ReactElement<any>,p=element.props;
 if(p['data-original-language']||element.type==='style')return node;
 const props:Record<string,any>={};
 for(const key of ['title','description','alt','aria-label','aria-valuetext','placeholder','socialImageAlt'])if(typeof p[key]==='string')props[key]=translateText(p[key],language);
 for(const key of ['href','path'])if(typeof p[key]==='string')props[key]=url(p[key],language);
 if(element.type==='meta'&&typeof p.content==='string')props.content=/url$/.test(p.property||'')?url(p.content,language):translateText(p.content,language);
 if(element.type==='script'&&p.type==='application/ld+json'&&p.dangerouslySetInnerHTML){try{props.dangerouslySetInnerHTML={__html:JSON.stringify(schema(JSON.parse(p.dangerouslySetInnerHTML.__html),language)).replace(/</g,'\\u003c')}}catch{}}
 if(p.children!==undefined&&element.type!==DesktopActionText&&element.type!==DesktopAppLink)props.children=translate(p.children,language);
 return cloneElement(element,props);
}
export default function LocalizedContent({children}:{children:ReactNode}){const {language}=useSiteLanguage();return <>{language!=='en'?translate(children,language):children}</>}
