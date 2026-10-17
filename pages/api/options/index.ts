import type {NextApiRequest,NextApiResponse} from 'next';
import {chain,trades,queueSymbol} from '../../../lib/options-server';
import {validExpiry} from '../../../lib/options';
const visits=new Map<string,{time:number,count:number}>();
export default async function handler(req:NextApiRequest,res:NextApiResponse){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(!['GET','POST'].includes(req.method||'')){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Method not allowed'})}
 if(req.query.symbol!==undefined&&typeof req.query.symbol!=='string')return res.status(400).json({error:'Invalid symbol'});
 const expiry=req.query.expiry;if(expiry!==undefined&&(typeof expiry!=='string'||!validExpiry(expiry)))return res.status(400).json({error:'Invalid expiration'});
 const input=req.method==='POST'?req.body?.symbol:req.query.symbol;const symbol=typeof input==='string'?input.toUpperCase():'SPY';
 if(!/^[A-Z][A-Z0-9.-]{0,9}$/.test(symbol))return res.status(400).json({error:'Choose a supported symbol'});
 const id=req.query.contract;if(id!==undefined&&(typeof id!=='string'||!/^O:[A-Z]{1,5}\d{6}[CP]\d{8}$/.test(id)))return res.status(400).json({error:'Invalid contract'});
 const ip=req.socket.remoteAddress||'unknown',now=Date.now();if(visits.size>5000)visits.clear();const visit=visits.get(ip);if(visit&&now-visit.time<60000){if(++visit.count>120){res.setHeader('Retry-After','60');return res.status(429).json({error:'Please wait before refreshing'})}}else visits.set(ip,{time:now,count:1});
 try{if(req.method==='POST'){const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host)return res.status(403).json({error:'Invalid request origin'});return res.status(200).json(await queueSymbol(symbol));}return res.status(200).json(id?await trades(symbol,id as string):await chain(symbol,expiry as string|undefined))}
 catch{return res.status(503).json({error:'Options data is temporarily unavailable. Please try again.'})}
}
