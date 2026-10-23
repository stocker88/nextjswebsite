const fs=require('node:fs'),path=require('node:path');
const WEEK=7*86400000;
const symbol=value=>String(value||'').trim().replace(/^[#$]/,'').toUpperCase().replace(/\./g,'-');
function buildTrades(results,research,now=Date.now()){
 // research.json is the public researchPreviews projection. Its server query
 // and scheduled-feed builder include only posts where isAIAdvisor=true.
 const posts=new Map(research.filter(p=>p.isAIAdvisor!==false).map(p=>[p.id,p]));
 return results.flatMap(result=>{
  const post=posts.get(result.id),time=typeof post?.time==='number'?(post.time<1e12?post.time*1000:post.time):NaN;
  const session=Date.parse(result.sessionDay+'T12:00:00Z');
  if(!post||!Number.isFinite(time)||time>now||time<now-WEEK||!Number.isFinite(session)||session<now-WEEK||session>now+86400000)return [];
  if(!/^options_results_[A-Z0-9.-]+_\d{4}-\d{2}-\d{2}$/.test(result.id)||!post.symbols?.some(s=>symbol(s)===symbol(result.symbol)))return [];
  return [{symbol:result.symbol,postId:result.id,isAIAdvisor:true,title:result.title,sessionDate:result.sessionDay,publishedAt:new Date(time).toISOString(),href:'/results/'+result.id.toLowerCase().replace(/_/g,'-')+'/'}];
 }).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
function build(root=path.join(__dirname,'..')){
 const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'));
 const items=buildTrades(read('option-results'),read('research'));
 fs.writeFileSync(path.join(root,'data/mover-trades.json'),JSON.stringify(items,null,2)+'\n');
 console.log('Saved',items.length,'recent AI-advisor options-result links');return items;
}
if(require.main===module)build();
module.exports={build,buildTrades};
