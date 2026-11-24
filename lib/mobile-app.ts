export const APPLE_STORE_URL='https://apps.apple.com/us/app/id1565527320';
export const GOOGLE_STORE_URL='https://play.google.com/store/apps/details?id=com.newcompany.stocker';
export function mobileStoreUrl(userAgent:string):string{
 return /Android/i.test(userAgent)?GOOGLE_STORE_URL:APPLE_STORE_URL;
}
export function isMobileAccountPath(path:string):boolean{
 return /^\/(?:login|signup|sign-up|register|onboarding|continue|membership|ultra|account)(?:\/|[?#]|$)/i.test(path);
}
