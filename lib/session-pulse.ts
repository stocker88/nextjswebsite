import {ExtendedSession,SessionKind,sessionRows} from './extended-hours';
const instruments=[['^SPX','S&P 500','Large U.S. stocks'],['QQQ','Nasdaq · QQQ','Nasdaq-100 ETF'],['^RUT','Russell 2000','Small U.S. stocks'],['GC=F','Gold','Precious metal'],['CL=F','Oil · WTI','Energy prices'],['BTC-USD','Bitcoin','Digital currency']];
export function sessionPulseRows(session:ExtendedSession,kind:SessionKind) {
 return instruments.map(([id,name,detail])=>{
  const quote=session.pulse?.[id];
  // Apply the stock heatmap's Eastern session window, including early closes.
  const template=session.rows[0];
  const valid=quote&&Number.isFinite(quote.price)&&quote.price>0&&Number.isFinite(quote.previousClose)&&quote.previousClose>0&&template&&sessionRows({...session,rows:[{...template,quoteAsOf:quote.quotedAt,changes:{...template.changes,day:0}} as typeof template]},kind)[0]?.changes.day===0;
  const proxy=quote?.sourceSymbol==='SPY'?'SPY ETF proxy':quote?.sourceSymbol==='IWM'?'IWM ETF proxy':detail;
  return {id,name,detail:proxy,change:valid?(quote.price/quote.previousClose-1)*100:null,quotedAt:valid?quote.quotedAt:null};
 });
}
