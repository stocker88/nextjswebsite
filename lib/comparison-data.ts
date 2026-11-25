import type {ToolAsset} from './seo-tools';
export type ComparisonData={asset:ToolAsset;metrics:{label:string;value:string;date:string|null}[];news:{title:string;href:string;date:string|null}[]};
export type ComparisonChoice={symbol:string;name:string;slug:string};
