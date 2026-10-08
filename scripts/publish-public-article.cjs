const fs=require('fs');
const path=require('path');
function validateArticle(a) {
 const required=['postId','summary','reviewer','publishedAt','updatedAt','disclosure'];
 for(const key of required) if(typeof a[key]!=='string'||!a[key].trim()) throw Error(`Missing ${key}`);
 if(!a.author||!a.author.name||!/^https:\/\//.test(a.author.url)) throw Error('An author name and HTTPS profile are required');
 if(a.approved!==true) throw Error('Explicit editorial approval is required');
 if(typeof a.aiAssisted!=='boolean') throw Error('Declare AI assistance');
 if(!Array.isArray(a.paragraphs)||a.paragraphs.length<2||a.paragraphs.some(p=>typeof p!=='string'||!p.trim())) throw Error('Provide the public article paragraphs');
 if(!Array.isArray(a.sources)||!a.sources.length||a.sources.some(s=>!s.title||!/^https:\/\//.test(s.url))) throw Error('Provide named HTTPS sources');
 if(!Number.isFinite(Date.parse(a.publishedAt))||!Number.isFinite(Date.parse(a.updatedAt))||Date.parse(a.updatedAt)<Date.parse(a.publishedAt)||Date.parse(a.updatedAt)>Date.now()) throw Error('Invalid publication/update dates');
 const {approved,...article}=a;return article;
}
module.exports={validateArticle};
if(require.main===module){try {
 const input=process.argv[2];if(!input)throw Error('Usage: node scripts/publish-public-article.cjs path/to/reviewed-article.json');
 const article=validateArticle(JSON.parse(fs.readFileSync(input,'utf8')));
 const root=path.resolve(__dirname,'..');const previews=JSON.parse(fs.readFileSync(path.join(root,'data/research.json'),'utf8'));
 if(!previews.some(p=>p.id===article.postId))throw Error('postId must match a public research preview');
 const target=path.join(root,'data/public-articles.json');const existing=JSON.parse(fs.readFileSync(target,'utf8'));
 const result=[...existing.filter(a=>a.postId!==article.postId),article];
 fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');console.log('Public article validated and saved. Build and deploy the website to publish.');
}catch(e){console.error(e.message);process.exitCode=1;}}
