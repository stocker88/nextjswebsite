const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
const {projectPosts}=require('./build-article-posts.cjs');
const articles=[{postId:'market-original'},{postId:'mover-original'},{postId:'missing'},{postId:'attached'}];
const image={url:'https://example.com/original.png',filename:'Market.png'};
const parent={id:'market-original',title:'Same headline',symbols:[],likes:13,comments:2,images:[image],attachedThreads:[{id:'attached',likes:1,comments:0},{id:'mover-original',likes:99,comments:99}]};
const posts=[{id:'other',title:'Same headline',likes:1000,comments:1000,images:[{url:'https://example.com/wrong.png'}]},parent,{id:'mover-original',likes:0,comments:0,images:[]}];
const projected=projectPosts(articles,posts),byId=new Map(projected.map(p=>[p.id,p]));
assert.deepEqual(byId.get('market-original'),{id:'market-original',likes:13,comments:2,images:[image]});
assert.equal(byId.has('missing'),false);assert.equal(byId.has('other'),false);
assert.deepEqual([byId.get('mover-original').likes,byId.get('mover-original').comments],[0,0]);
assert.equal(byId.get('attached').likes,1);
assert.equal(projectPosts([{postId:'unknown'}],[{id:'unknown',likes:-1,comments:NaN}])[0].likes,null);
const mod={exports:{}};
const code=ts.transpileModule(fs.readFileSync('lib/article-posts.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;
let requests=0,fail=false;
const fetchResearchPage=async()=>{requests++;await Promise.resolve();if(fail)throw Error('offline');return{payload:{items:posts,next:null}};};
new Function('require','module','exports',code)(name=>name.endsWith('article-posts.json')?[]:name==='./research-feed'?{fetchResearchPage,researchEndpoint:'https://example.com/feed'}:null,mod,mod.exports);
(async()=>{
 const live=mod.exports.articlePostIndex(posts);
 assert.deepEqual(live.get('market-original'),byId.get('market-original'));
 assert.equal(live.get('mover-original').likes,0);
 assert.equal(mod.exports.articlePostIndex([{...parent,likes:undefined,comments:undefined}]).get('market-original').likes,null);
 const [a,b]=await Promise.all([mod.exports.loadArticlePosts(),mod.exports.loadArticlePosts()]);
 assert.equal(requests,1);assert.equal(a,b);assert.equal(a.get('market-original').images[0].url,image.url);
 await mod.exports.loadArticlePosts();assert.equal(requests,1);
 const realNow=Date.now;Date.now=()=>realNow()+6*60000;fail=true;
 try{assert.equal((await mod.exports.loadArticlePosts()).get('market-original').likes,13);await mod.exports.loadArticlePosts();assert.equal(requests,2);}finally{Date.now=realNow;}
 console.log('PASS: exact post IDs, original images/raw counters, missing post exclusion, attachment precedence, request coalescing, refresh cache and offline retention.');
})().catch(e=>{console.error(e);process.exitCode=1;});
