import {useState} from 'react';
import type {ComparisonChoice} from '../lib/comparison-data';
import s from './SeoTools.module.css';
export default function ComparisonSelector({choices,a,b,onCompare}:{choices:ComparisonChoice[];a:string;b:string;onCompare?:(a:string,b:string)=>void}){
 const [left,setLeft]=useState(a),[right,setRight]=useState(b),[error,setError]=useState('');
 return <form className={s.panel} onSubmit={e=>{e.preventDefault();const x=left.trim().toUpperCase(),y=right.trim().toUpperCase();if(x===y||![x,y].every(v=>choices.some(c=>c.symbol===v))){setError('Choose two different stocks from the list.');return;}setError('');if(onCompare)onCompare(x,y);else window.location.href='/stock-comparison/?a='+encodeURIComponent(x)+'&b='+encodeURIComponent(y);}}><h2>Choose any two stocks</h2><div className={s.controls}><label>First company<input list="comparison-stocks" value={left} onChange={e=>setLeft(e.target.value)} placeholder="Ticker or company"/></label><label>Second company<input list="comparison-stocks" value={right} onChange={e=>setRight(e.target.value)} placeholder="Ticker or company"/></label></div><datalist id="comparison-stocks">{choices.map(c=><option key={c.symbol} value={c.symbol}>{c.name}</option>)}</datalist><button type="submit">Compare stocks</button>{error&&<p role="alert">{error}</p>}</form>;
}
