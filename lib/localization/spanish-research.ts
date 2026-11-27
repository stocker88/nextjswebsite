import messages from '../../data/localization/es-research.json';
import ui from '../../data/localization/es-ui.json';
const dictionary:Record<string,string>={...ui,...messages};
export function spanishText(value:string):string{
 const key=value.replace(/\s+/g,' ').trim();
 const translated=dictionary[key];
 if(translated!==undefined)return value.replace(/\S[\s\S]*\S|\S/,translated);
 const recurring=key.match(/^(.*?) · estimated recurring window \(not a confirmed date\)$/);
 if(recurring)return spanishText(recurring[1])+ ' · ventana recurrente estimada (fecha no confirmada)';
 const earnings=key.match(/^(.+) earnings$/);if(earnings)return earnings[1]+': resultados';
 const dated=key.match(/^(Price snapshot: | · Financials: |Saved reading · )(.*)$/);if(dated)return ({'Price snapshot: ':'Fecha del precio: ',' · Financials: ':' · Datos financieros: ','Saved reading · ':'Lectura guardada · '} as Record<string,string>)[dated[1]]+spanishText(dated[2]);
 const month=key.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})(.*)$/);
 if(month)return `${month[2]} ${({Jan:'ene',Feb:'feb',Mar:'mar',Apr:'abr',May:'may',Jun:'jun',Jul:'jul',Aug:'ago',Sep:'sep',Oct:'oct',Nov:'nov',Dec:'dic'} as Record<string,string>)[month[1]]}${month[3]}`;
 const patterns:[RegExp,(...args:any[])=>string][]=[
  [/^([+−-]?[0-9.]+) points$/,(_,n)=>`${n} puntos`],
  [/^Observation updated (.+)$/,(_,date)=>`Observación actualizada ${spanishText(date)}`],
  [/^Fear and Greed Index (.+) out of 100, (.+)$/,(_,n,label)=>`Índice de miedo y codicia: ${n} sobre 100, ${spanishText(label)}`],
  [/^Share (.+)$/,(_,name)=>`Compartir ${name}`],
  [/^(.+) earnings previews and market catalysts$/,(_,symbol)=>`${symbol}: próximos resultados y catalizadores del mercado`],
  [/^Hide (.+) from chart$/,(_,symbol)=>`Ocultar ${symbol} del gráfico`],
  [/^(.+) adjusted closing prices from (.+) to (.+), (.+), with (.+) through (.+)$/,(_,symbol,start,end,change,scenario,until)=>`${symbol}: precios de cierre ajustados de ${start} a ${end}, ${change}, con ${spanishText(scenario)} hasta ${until}`],
  [/^(.+) · (\d{4}-\d{2}-\d{2})$/,(_,label,date)=>`${spanishText(label)} · ${date}`],
  [/^What is the (.+) stock price prediction for (.+)\?$/,(_,name,period)=>`¿Cuál es la predicción del precio de ${name} para ${spanishText(period)}?`],
  [/^What growth is already priced into (.+)\?$/,(_,symbol)=>`¿Qué crecimiento descuenta ya el precio de ${symbol}?`],
  [/^Will (.+) fall before inflation data or an interest-rate decision\?$/,(_,symbol)=>`¿Caerá ${symbol} antes de los datos de inflación o de una decisión de tipos?`],
  [/^How should I use (.+) price predictions on Reddit\?$/,(_,name)=>`¿Cómo utilizar las predicciones de ${name} en Reddit?`],
  [/^Explore the interactive (.+) price chart and (.+) outlook, then compare earnings growth,[\s\S]*$/,(_,symbol,period)=>`Explora el gráfico interactivo de ${symbol} y sus perspectivas para ${spanishText(period)}. Compara crecimiento del beneficio, valoración y análisis empresarial. Selecciona un escenario y ajusta los controles. Son ilustraciones condicionales, no consenso de analistas ni precios garantizados.`],
  [/^A higher share price can already reflect[\s\S]*$/,()=>`Un precio más alto puede reflejar ya expectativas de crecimiento elevadas. En el modelo de largo plazo, el crecimiento del beneficio eleva el precio y una caída del múltiplo lo compensa. Contrasta ingresos, márgenes, deuda y valoración. Los supuestos son ejemplos de sensibilidad, no afirmaciones sobre lo que espera el mercado.`],
  [/^By (\d{4}), the result depends[\s\S]*$/,(_,year)=>`Para ${year}, el resultado depende de la persistencia del crecimiento del beneficio por acción y de la valoración que pagan los inversores. Incluso con beneficios crecientes, el precio puede caer si el múltiplo se reduce más deprisa.`],
  [/^Explore (.+) Competitors$/,(_,symbol)=>`Explora los competidores de ${symbol}`],
  [/^(\d+) companies$/,(_,n)=>`${n} empresas`],
  [/^(\d+) activity spikes?$/,(_,n)=>`${n} picos de actividad`],
  [/^Saved reading · (.+)$/,(_,date)=>`Lectura guardada · ${date}`],
  [/^(\d+) reports in view · E marks reporting dates$/,(_,n)=>`${n} informes visibles · E indica fechas de resultados`],
  [/^(.+) earnings \(expected\)$/,(_,symbol)=>`${symbol}: resultados previstos`],
  [/^(.+) earnings and valuation$/,(_,symbol)=>`${symbol}: resultados y valoración`],
  [/^(.+) prediction period$/,(_,symbol)=>`Período de predicción de ${symbol}`],
 ];
 for(const [pattern,replace] of patterns)if(pattern.test(key))return key.replace(pattern,replace);
 return value;
}
