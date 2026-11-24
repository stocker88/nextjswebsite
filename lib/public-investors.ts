import type {TrackerProfile,TrackerDetail} from './investor-tracker';
export const publicInvestors:(TrackerProfile&{slug:string})[]=[
 {id:'berkshire',slug:'warren-buffett',name:'Warren Buffett · Berkshire Hathaway',kind:'funds'},
 {id:'pershing',slug:'bill-ackman',name:'Bill Ackman · Pershing Square',kind:'funds'},
 {id:'appaloosa',slug:'david-tepper',name:'David Tepper · Appaloosa',kind:'funds'},
 {id:'duquesne',slug:'stanley-druckenmiller',name:'Stanley Druckenmiller · Duquesne',kind:'funds'},
 {id:'pelosi',slug:'nancy-pelosi',name:'Nancy Pelosi',kind:'politicians'},
 {id:'gottheimer',slug:'josh-gottheimer',name:'Josh Gottheimer',kind:'politicians'},
 {id:'khanna',slug:'ro-khanna',name:'Ro Khanna',kind:'politicians'},
 {id:'mccaul',slug:'michael-mccaul',name:'Michael McCaul',kind:'politicians'},
 {id:'meuser',slug:'dan-meuser',name:'Dan Meuser',kind:'politicians'},
 {id:'tuberville',slug:'tommy-tuberville',name:'Tommy Tuberville',kind:'politicians'},
];
export const investorPath=(id:string)=>'/smart-money/investors/'+publicInvestors.find(p=>p.id===id)!.slug+'/';
export async function loadPublicInvestor(id:string):Promise<TrackerDetail>{
 if(!publicInvestors.some(p=>p.id===id))throw Error('Unknown investor');
 const response=await fetch('/investor-tracker/'+id+'.json');
 if(!response.ok)throw Error('Saved filings unavailable');
 const value=await response.json();
 if(value.id!==id||!Array.isArray(value.rows)||!value.updatedAt)throw Error('Invalid filings');
 return {...value,following:false};
}
