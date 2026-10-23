import {catalog} from './catalog';
import {loadStockResearch,loadStockEarnings} from './stock-research-server';
import {recentStockNews} from './stocks';
import {fetchResearch} from './research-server';
import type {InstrumentResearchProps} from '../components/InstrumentResearch';
export async function loadInstrumentResearch(symbol:string):Promise<InstrumentResearchProps|null>{
 const item=catalog.find(i=>i.symbol===symbol);
 if(!item)return null;
 return {item,news:recentStockNews(await fetchResearch(),item.symbol),bundle:item.type==='EQUITY'?loadStockResearch(item.symbol):null,calendar:item.type==='EQUITY'?loadStockEarnings(item.symbol):null};
}
