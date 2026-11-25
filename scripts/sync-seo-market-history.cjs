// Reuses seven existing cache documents through a read-only endpoint. No provider calls.
const fs=require('node:fs'),path=require('node:path');
async function main(){
 const file=path.join(__dirname,'../data/seo-market-history.json');
 try{const response=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/seoMarketHistory',{signal:AbortSignal.timeout(60000)});if(!response.ok)throw Error('HTTP '+response.status);
 const data=await response.json();if(data.version!==1||!data.assets||Object.keys(data.assets).length<100)throw Error('Incomplete history');
 for(const [symbol,points] of Object.entries(data.assets)){if(!/^[A-Z0-9.^=-]{1,25}$/.test(symbol)||!Array.isArray(points)||points.length<40||points.some(p=>!Array.isArray(p)||!/^\d{4}-\d{2}-\d{2}$/.test(p[0])||!Number.isFinite(p[1])||p[1]<=0))throw Error('Invalid history');}
 fs.writeFileSync(file+'.tmp',JSON.stringify(data));fs.renameSync(file+'.tmp',file);console.log('SEO history:',Object.keys(data.assets).length,'cached symbols');
 }catch(e){if(!fs.existsSync(file))throw e;console.warn('Retaining dated SEO history:',e.message);}
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
