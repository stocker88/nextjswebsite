const fs=require('node:fs'),path=require('node:path');
// Join only immutable app IDs. Company names, dates and similar titles are not identities.
function projectPosts(articles,research){
 const wanted=new Set(articles.map(a=>a.postId).filter(Boolean));
 const posts=new Map();
 for(const parent of research){
  for(const post of [parent,...(parent.attachedThreads||[])]){
   if(!wanted.has(post.id)||posts.has(post.id))continue;
   const count=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0?Math.floor(value):null;
   posts.set(post.id,{id:post.id,likes:count(post.likes),comments:count(post.comments),images:(post.images||[]).filter(i=>i&&typeof i.url==='string'&&/^https:\/\//.test(i.url)).slice(0,3)});
  }
 }
 // Top-level posts are newer than embedded attachment snapshots.
 for(const post of research)if(wanted.has(post.id)){
  const count=value=>typeof value==='number'&&Number.isFinite(value)&&value>=0?Math.floor(value):null;
  posts.set(post.id,{id:post.id,likes:count(post.likes),comments:count(post.comments),images:(post.images||[]).filter(i=>i&&typeof i.url==='string'&&/^https:\/\//.test(i.url)).slice(0,3)});
 }
 return [...posts.values()];
}
function build(root=path.join(__dirname,'..')){
 const read=name=>JSON.parse(fs.readFileSync(path.join(root,'data',name+'.json'),'utf8'));
 const items=projectPosts([...read('mover-research'),...read('market-briefings')],read('research'));
 fs.writeFileSync(path.join(root,'data/article-posts.json'),JSON.stringify(items,null,2)+'\n');
 console.log('Saved',items.length,'original app post media and engagement records');return items;
}
if(require.main===module)build();
module.exports={build,projectPosts};
