const fs=require('node:fs'),path=require('node:path');
const publicFields=['id','symbol','companyName','sessionDay','title','source','stock','graphStock','moves','images','earningsPostId','earningsUrl','publishedAt','appCollection'];
function resultPreview(result){
 const preview=Object.fromEntries(publicFields.filter(key=>Object.hasOwn(result,key)).map(key=>[key,result[key]]));
 preview.previewSummary=(result.recap?.[0]||result.quickTake||'').slice(0,280);
 return preview;
}
function writeResultPreviews(root=path.join(__dirname,'..')){
 const results=JSON.parse(fs.readFileSync(path.join(root,'data/option-results.json'),'utf8'));
 fs.writeFileSync(path.join(root,'data/option-result-previews.json'),JSON.stringify(results.map(resultPreview),null,2)+'\n');
}
if(require.main===module)writeResultPreviews();
module.exports={resultPreview,writeResultPreviews};
