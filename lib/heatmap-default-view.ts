import {defaultMarketView,DefaultMarketView} from './default-market-view';
import {HeatSnapshot} from './market-heatmap';
import {validSession,sessionRows} from './extended-hours';
/** Never automatically select yesterday's or unavailable extended-hours quotes. */
export function heatmapDefaultView(now:number,snapshot:HeatSnapshot):DefaultMarketView {
 const view=defaultMarketView(now);
 if(view==='day')return view;
 const session=snapshot[view];
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p=>[p.type,p.value]));
 const today=`${parts.year}-${parts.month}-${parts.day}`;
 return validSession(session,view)&&session.asOf===today&&Date.parse(session.quotedAt)<=now&&sessionRows(session,view).some(row=>row.changes.day!==null)?view:'day';
}
