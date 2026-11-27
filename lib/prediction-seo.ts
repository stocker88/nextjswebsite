import type {SiteLanguage} from './localization/routes';
/** Daily snapshot data, never advertised as streaming prices. */
export function predictionSeo(name:string,symbol:string,period?:string,language:SiteLanguage='en'){
 const horizon=period?` for ${period}`:'';
 if(language==='es')return {title:`${name} (${symbol}): predicción del precio${period?` para ${period}`:''} y gráfico actualizado a diario`,description:`Consulta la predicción del precio de ${name} (${symbol})${period?` para ${period}`:''}, gráficos interactivos, resultados y datos financieros. Compara escenarios de crecimiento y valoración.`};
 if(language==='de')return {title:`${name} (${symbol}): Aktienkursprognose${period?` ${period}`:''} und Chart, täglich aktualisiert`,description:`Entdecken Sie die Aktienkursprognose für ${name} (${symbol})${period?` – ${period}`:''}, interaktive Charts, Ergebnisse und Finanzdaten. Vergleichen Sie Wachstums- und Bewertungsszenarien.`};
 if(language==='fr')return {title:`${name} (${symbol}) : prévision du cours${period?` pour ${period}`:''} et graphique actualisé chaque jour`,description:`Explorez les prévisions de ${name} (${symbol})${period?` pour ${period}`:''}, graphiques interactifs, résultats et données financières. Comparez croissance et valorisation.`};
 if(language==='ja')return {title:`${name}（${symbol}）の株価予測${period?`：${period}`:''}｜毎日更新のチャートと見通し`,description:`${name}（${symbol}）の${period?period+'の':''}株価予測、チャート、決算、財務データを確認。成長率と評価倍率のシナリオを比較できます。`};
 if(language==='ko')return {title:`${name}(${symbol}) 주가 예측${period?` · ${period}`:''} | 매일 갱신되는 차트와 전망`,description:`${name}(${symbol})의 ${period?period+' ':''}주가 예측, 차트, 실적, 재무 데이터를 살펴보고 성장 및 밸류에이션 시나리오를 비교하세요.`};
 return {title:`${name} (${symbol}) Stock Price Prediction${horizon}: Price Chart & Forecast Updated Daily`,description:`Explore ${name} (${symbol}) stock price predictions${horizon}, interactive charts, earnings, financials and company news. Compare growth and valuation scenarios.`};
}
