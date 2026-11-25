import {useState} from 'react';
import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,Tooltip,CartesianGrid} from 'recharts';
import type {ComparisonData} from '../lib/comparison-data';
import {readableDate,compare} from '../lib/seo-tools';
import StockPeerAnalysis from './StockPeerAnalysis';
import s from './SeoTools.module.css';
const options=[['price','Stock price'],['revenue','Revenue'],['eps','Earnings per share'],['netIncome','Net income']];
export default function ComparisonCharts({data}:{data:ComparisonData[]}){
 const [graph,setGraph]=useState('price'),[period,setPeriod]=useState('1Y'),[scale,setScale]=useState('relative'),[visible,setVisible]=useState([true,true]),[peer,setPeer]=useState(0);
 const raw=data.map(d=>graph==='price'?{points:d.asset.points,currency:d.asset.currency}:d.graphs?.find(g=>g.key===graph));
 const last=Math.max(...raw.flatMap(g=>g?.points.map(p=>Date.parse(p[0]))||[]));
 const days:Record<string,number>={'1M':31,'3M':93,'6M':186,'1Y':366,'3Y':1096,'ALL':Infinity};
 const cutoff=last-days[period]*86400000;
 let series=raw.map(g=>(g?.points||[]).filter(p=>Date.parse(p[0])>=cutoff));
 // Relative prices always start on the same shared closing date.
 if(graph==='price'&&scale==='relative'){const aligned=compare(series[0],series[1]);series=aligned?[aligned.rows.map(r=>[r.date,r.a]),aligned.rows.map(r=>[r.date,r.b])]:[[],[]];}
 const rows=new Map<string,any>();
 series.forEach((points,i)=>points.forEach(([date,value])=>{const base=points[0]?.[1];const v=scale==='relative'?(base?((value-base)/Math.abs(base))*100:null):value;rows.set(date,{...rows.get(date),date,time:Date.parse(date),['v'+i]:v});}));
 const chartRows=Array.from(rows.values()).sort((a,b)=>a.date.localeCompare(b.date));
 const colors=['#83b6ff','#c4a5ff'];
 const label=options.find(o=>o[0]===graph)![1];
 return <><section className={s.panel}><h2>Compare graphs</h2><div className={s.controls}>
 <label>Graph<select value={graph} onChange={e=>setGraph(e.target.value)}>{options.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
 <label>Display<select value={scale} onChange={e=>setScale(e.target.value)}><option value="relative">Percentage change</option><option value="actual">Reported values</option></select></label></div>
 <div className={s.links} role="group" aria-label="Chart period">{Object.keys(days).map(p=><button key={p} type="button" aria-pressed={period===p} onClick={()=>setPeriod(p)} style={{background:period===p?'#c4a5ff':'#24344c',color:period===p?'#101725':'#eef3ff'}}>{p==='ALL'?'All available':p}</button>)}</div>
 <div className={s.links} role="group" aria-label="Visible companies">{data.map((d,i)=><button key={d.asset.symbol} type="button" aria-pressed={visible[i]} onClick={()=>setVisible(v=>v.map((on,j)=>j===i?!on:on))} style={{background:visible[i]?colors[i]:'#24344c',color:visible[i]?'#101725':'#eef3ff'}}>{visible[i]?'✓ ':''}{d.asset.symbol}</button>)}</div>
 <p>{label} · {scale==='relative'?'Change from the first available value in this window.':'Values use each company’s reporting currency.'} Hover or tap a point for its date and value.</p>
 {graph!=='price'&&<p>Financial points use each company’s own reporting dates; quarters may differ. {data.map((d,i)=>d.asset.symbol+': '+(raw[i]?.currency||'currency unreported')).join(' · ')}.</p>}
 {chartRows.length&&visible.some(Boolean)?<div style={{width:'100%',height:360}} role="img" aria-label={label+' comparison chart'}><ResponsiveContainer><LineChart data={chartRows} margin={{top:16,right:24,left:12,bottom:16}}><CartesianGrid stroke="#2d4059" strokeDasharray="4 4"/><XAxis dataKey="time" type="number" domain={['dataMin','dataMax']} tickFormatter={v=>readableDate(new Date(v).toISOString().slice(0,10))} minTickGap={45} stroke="#aebed3"/><YAxis tickFormatter={v=>new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(v)+(scale==='relative'?'%':'')} stroke="#aebed3"/><Tooltip labelFormatter={v=>readableDate(new Date(Number(v)).toISOString().slice(0,10))} contentStyle={{background:'#122136',border:'1px solid #526583',borderRadius:12}} formatter={(v:any,name:any)=>[new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(Number(v))+(scale==='relative'?'%':''),name]}/>{data.map((d,i)=>visible[i]&&<Line key={d.asset.symbol} dataKey={'v'+i} name={d.asset.symbol} stroke={colors[i]} strokeWidth={3} dot={graph==='price'?false:{r:4}} activeDot={{r:6}} connectNulls={graph!=='price'} isAnimationActive={false}/>)}</LineChart></ResponsiveContainer></div>:<p role="status">{visible.some(Boolean)?'No comparable history in this window. Try a longer period or another graph.':'Select a company to show its graph.'}</p>}
 {data.map((d,i)=>!series[i].length&&<p key={d.asset.symbol}>{d.asset.symbol}: no {label.toLowerCase()} history available for this period.</p>)}
 <p>Only available history is shown. Financial lines connect reported points; they are not daily measurements.</p></section>
 <section className={s.panel}><h2>Industry peers</h2><div className={s.links} role="group" aria-label="Peer group">{data.map((d,i)=><button key={d.asset.symbol} aria-pressed={peer===i} onClick={()=>setPeer(i)} style={{background:peer===i?'#c4a5ff':'#24344c',color:peer===i?'#101725':'#eef3ff'}}>{d.asset.symbol} peers</button>)}</div><StockPeerAnalysis key={data[peer].asset.symbol} symbol={data[peer].asset.symbol} companies={data[peer].peers||[]} /></section></>;
}
