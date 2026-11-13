import {Disclosure, actionLabel, count, money, displayDate} from './smart-money';

export const fundActivityIds: Record<string,string> = {
  berkshire: 'fund:0001067983', pershing: 'fund:0002026053',
  appaloosa: 'fund:0001656456', duquesne: 'fund:0001536411',
};
export const trackerForActivity = (id:string) => Object.keys(fundActivityIds).find(key => fundActivityIds[key] === id);
export const activityPath = (id:string) => '/hedge-fund-activity/?investor='+encodeURIComponent(fundActivityIds[id])+'#activity';

export function activityText(rows:Disclosure[]) {
  const investors = new Set(rows.map(r=>r.investor));
  const title = investors.size===1 ? rows[0].investor+' · Disclosed activity' : 'Disclosed investor activity';
  return [title, '', ...rows.map(r=>[
    (r.symbol.startsWith('CUSIP ')?r.symbol:'$'+r.symbol)+' '+(r.company||r.securityType),
    actionLabel(r.action), r.shares===null?'Quantity not disclosed':count(r.shares)+' shares',
    (r.amount||money(r.value))+(r.category==='funds'?' holding':' reported value'),
    r.weight===null?'':r.weight.toFixed(2)+'% weight',
    displayDate(r.period||r.eventDate||r.filedDate),
    investors.size===1?'':r.investor,
  ].filter(Boolean).join(' · ')), '', 'Fund values are quarter-end holdings, not trade amounts.', 'Source: StocksToBuyNow.ai'].join('\n');
}
