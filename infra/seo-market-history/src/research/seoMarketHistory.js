// Public prices only. Never calls a provider or reads account/user collections.
const functions=require('firebase-functions');
const {admin}=require('../utils/firebase');
const GROUPS=['abStockList','cdStockList','efghStockList','ijklStockList','pqrsStockList','othersStockList','cryptoData'];
const {project}=require('./seoMarketHistoryCore');

let saved=null,pending=null,expires=0;
exports.seoMarketHistory=functions.runWith({timeoutSeconds:60,memory:'512MB',maxInstances:2}).https.onRequest(async(req,res)=>{
 res.set('Access-Control-Allow-Origin','*');
 if(req.method!=='GET')return res.status(405).json({error:'GET required'});
 try{
  if(!saved||Date.now()>expires){
   if(!pending)pending=admin.firestore().getAll(...GROUPS.map(g=>admin.firestore().doc('cachedMarketData/'+g+'_3m'))).then(docs=>{const next=project(docs.map(d=>d.data()||{}));if(Object.keys(next.assets).length<100)throw Error('Incomplete price cache');saved=next;expires=Date.now()+6*3600000;}).finally(()=>{pending=null;});
   await pending;
  }
  res.set('Cache-Control','public,max-age=3600,s-maxage=21600');return res.json(saved);
 }catch(error){console.error('SEO history unavailable',error.message);return res.status(503).json({error:'Price history temporarily unavailable'});}
});
exports.project=project;
