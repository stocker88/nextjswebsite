import {useRouter} from 'next/router';
import {languageOf,languagePath} from './routes';
import {translateText} from './translate';
export function useSiteLanguage(){const router=useRouter(),language=languageOf(router.asPath||router.pathname);return {language,locale:language==='en'?'en-US':language,t:(english:string)=>translateText(english,language),href:(path:string)=>languagePath(path,language)};}
