// Only versioned generated objects guarantee a sibling preview. Legacy URLs pass through.
export function generatedImagePreview(original:string):string {
 try {
  const u=new URL(original);
  if(u.protocol!=='https:'||u.hostname!=='firebasestorage.googleapis.com')return original;
  const prefix='/v0/b/stocker-fcda2.appspot.com/o/';
  if(!u.pathname.startsWith(prefix))return original;
  const name=decodeURIComponent(u.pathname.slice(prefix.length));
  if(!/^(post-banners\/v2|generated-images\/v1)\//.test(name)||!name.endsWith('.jpg')||name.endsWith('.feed.jpg'))return original;
  u.pathname=prefix+encodeURIComponent(name.slice(0,-4)+'.feed.jpg');return u.toString();
 }catch{return original;}
}
