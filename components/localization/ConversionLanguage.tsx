import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {conversionRoutes,languageOf,languagePath,routePath,LANGUAGE_PREFERENCE_KEY} from '../../lib/localization/routes';
import {clientLanguage} from '../../lib/localization/client-language';
export default function ConversionLanguage(){const router=useRouter();useEffect(()=>{if(!router.isReady)return;const language=languageOf(router.asPath);if(language!=='en'){try{localStorage.setItem(LANGUAGE_PREFERENCE_KEY,language)}catch{}return;}if((conversionRoutes as readonly string[]).includes(routePath(router.asPath))){const preferred=clientLanguage();if(preferred!=='en')void router.replace(languagePath(router.asPath,preferred));}},[router.isReady,router.asPath]);return null;}
