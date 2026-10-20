import type {PeerCompany} from './peer-analysis';
import type {Detail} from './earnings';
export type Financial={date:string;currency:string|null;revenue:number|null;netIncome:number|null;grossProfit:number|null;operatingIncome:number|null;ebitda:number|null;operatingCashFlow:number|null;capitalExpenditure:number|null;assets:number|null;liabilities:number|null;equity:number|null;cash:number|null;debt:number|null;debtToEquity:number|null;currentRatio:number|null;quickRatio:number|null;netMargin:number|null;grossMargin:number|null};
export type Peer={symbol:string;name:string;detail:Detail|null;financials:Financial[]};
export type Snapshot={symbol:string;updatedAt:string;detail:Detail|null;financials:Financial[];shortInterest:{date:string;daysToCover:number|null;floatShorted:number|null}|null;technicals:Record<string,number|null>;peers:Peer[]};
export type Macro={id:string;title:string;units:string;sourceUrl:string;points:[string,number][]};
export type Catalyst={id:string;date:string;title:string;timeLabel:string;watch:string;sourceUrl:string;status:string};
export type ResearchBundle={snapshot:Snapshot|null;peerAnalysis?:PeerCompany[];macro:Macro[];events:Catalyst[];today:string};
