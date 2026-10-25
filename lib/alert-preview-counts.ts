// Display-only preview values. Never use these as disclosure or signal data.
export function dailyAlertPreviewCounts(now=new Date()){
 const day=Number(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',day:'numeric'}).format(now));
 return {insiders:4+(day-1)%7,politicians:4+(day+2)%7};
}
