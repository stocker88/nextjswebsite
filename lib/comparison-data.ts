import type {PeerCompany} from './peer-analysis';
import type {ToolAsset} from './seo-tools';
export type ComparisonData={asset:ToolAsset;graphs?:{key:string;label:string;currency:string|null;points:[string,number][]}[];peers?:PeerCompany[];metrics:{label:string;value:string;date:string|null}[];news:{title:string;href:string;date:string|null}[]};
export type ComparisonChoice={symbol:string;name:string;slug:string};
