const assert=require('node:assert/strict');
const URL='https://firebasestorage.googleapis.com/v0/b/stocker-fcda2.appspot.com/o/market-recaps%2Fweekly%2Findex.json?alt=media&token=published-weekly-market-recaps';
const TITLES=['Weekly heatmap, market pulse and movers','Next week’s earnings and market events','Weekly heatmap & movers'];
function validateWeekly(a){
 assert(a.version===1&&a.status==='published'&&a.kind==='weekly'&&/^ai_market_recap_\d{4}-\d{2}-\d{2}_weekly$/.test(a.id)&&a.postId===a.id);
 assert(/^weekly-market-recap-\d{4}-\d{2}-\d{2}$/.test(a.slug)&&a.title&&a.summary&&Number.isFinite(Date.parse(a.publishedAt))&&Number.isFinite(Date.parse(a.updatedAt)));
 assert(a.sections?.length&&a.sections.every(s=>s.heading&&s.text)&&a.sources?.length&&a.sources.every(s=>s.title&&/^https:\/\//.test(s.url)));
 assert(a.images?.length===3&&a.images.every((im,i)=>im.title===TITLES[i]&&im.width===1200&&im.height===1200&&/^https:\/\//.test(im.url)));
 return a;
}
async function weeklyBriefings(){const response=await fetch(URL+'&refresh='+Date.now(),{signal:AbortSignal.timeout(30000)});if(response.status===404)return [];if(!response.ok)throw Error('Weekly briefings unavailable');const all=await response.json();assert(Array.isArray(all));return all.map(validateWeekly);}
module.exports={weeklyBriefings,validateWeekly};
