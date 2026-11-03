// Exercise the real signup save with in-memory Firebase doubles only.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=fs.readFileSync('lib/profile-onboarding.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const answers={experience:'Beginner',interest:'Stocks',horizon:'Long-term'};

function fixture({photoURL=null,taken=false,changedAccount=false}={}){
 const user={uid:'photo-test',email:'test@example.invalid',photoURL,emailVerified:true};
 const writes=[],uploads=[],profileUpdates=[],events=[];
 let storageLoads=0;
 const absent={exists:()=>false,data:()=>undefined};
 const sdk={
  getFirestore:()=>({}),doc:(_,collection,id)=>`${collection}/${id}`,
  collection:(_,name)=>name,where:()=>({}),limit:()=>({}),query:()=>({}),
  getDocs:async()=>({docs:taken?[{id:'another-account',data:()=>({userName:'photo_test'})}]:[]}),getDoc:async()=>absent,
  serverTimestamp:()=>123,
  runTransaction:async(_,callback)=>callback({get:async()=>absent,set:(ref,value)=>writes.push({ref,value})}),
 };
 const modules={
  './site-auth':{getSiteAuth:async()=>({app:{},currentUser:{uid:changedAccount?'different':user.uid}})},
  './site-account-hint':{rememberSiteAccount(){}},
  'firebase/firestore':sdk,
  'firebase/auth':{updateProfile:async(_,value)=>profileUpdates.push(value)},
  'firebase/storage':{getStorage:()=>({}),ref:(_,path)=>path,uploadBytes:async(...args)=>uploads.push(args),getDownloadURL:async()=>'https://example.invalid/upload.jpg',deleteObject:async()=>{}},
 };
 const exports={};
 vm.runInNewContext(code,{
  exports,require:name=>{if(name==='firebase/storage')storageLoads++;assert.ok(modules[name],`Unexpected module ${name}`);return modules[name]},
  navigator:{language:'en-US',userAgent:'test'},window:{innerHeight:844,innerWidth:390,dispatchEvent:event=>events.push(event)},
  localStorage:{setItem(){}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},Date,
 });
 return {user,writes,uploads,profileUpdates,events,storageLoads:()=>storageLoads,save:(photoFile=null)=>exports.completeProfileOnboarding(user,{userName:'photo_test',photoFile,answers})};
}

(async()=>{
 const noPhoto=fixture();await noPhoto.save();
 assert.equal(noPhoto.writes.find(w=>w.ref==='users/photo-test').value.photoUrl,'');
 assert.equal(noPhoto.profileUpdates[0].photoURL,'');
 assert.equal(noPhoto.storageLoads(),0,'No photo means no storage calls');
 assert.equal(noPhoto.events[0].detail.photoUrl,'');

 const provider=fixture({photoURL:'https://example.invalid/provider.jpg'});await provider.save();
 assert.equal(provider.profileUpdates[0].photoURL,'https://example.invalid/provider.jpg');
 assert.equal(provider.storageLoads(),0);

 const upload=fixture();await upload.save({type:'image/jpeg'});
 assert.equal(upload.uploads.length,1);assert.equal(upload.profileUpdates[0].photoURL,'https://example.invalid/upload.jpg');

 const collision=fixture({taken:true});await collision.save();
 assert.notEqual(collision.writes.find(w=>w.ref==='users/photo-test').value.userName,'photo_test','Taken usernames receive an available alternative');
 for(const options of [{changedAccount:true}]){
  const blocked=fixture(options);
  await assert.rejects(blocked.save(),/account changed/);
  assert.equal(blocked.writes.length,0);assert.equal(blocked.storageLoads(),0);
 }
 console.log('PASS: no-photo signup, provider photo, optional upload, username collision and account-change safeguards.');
})().catch(error=>{console.error(error);process.exitCode=1});
