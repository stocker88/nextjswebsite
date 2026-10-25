export const PRO_WEB_LAUNCH={
 title:'Stocks To Buy Now AI - Pro web launch and live video demo',
 label:'December 1, 2026',
 starts:'20261201',ends:'20261202',
 url:'https://www.stockstobuynow.ai/membership/',
 description:'The live Pro web version of Stocks To Buy Now AI launches December 1, 2026, with a live video demo. All-day launch reminder. Demo time and viewing link will be announced on the membership page. Pro is available in the app now: sign in with the same account you use on the website.',
};
export function proLaunchGoogleCalendarUrl(){
 const p=new URLSearchParams({action:'TEMPLATE',text:PRO_WEB_LAUNCH.title,dates:PRO_WEB_LAUNCH.starts+'/'+PRO_WEB_LAUNCH.ends,details:PRO_WEB_LAUNCH.description,location:PRO_WEB_LAUNCH.url});
 return 'https://calendar.google.com/calendar/render?'+p.toString();
}
