const fs=require('node:fs');
const url='https://firebasestorage.googleapis.com/v0/b/stocker-fcda2.appspot.com/o/option-results%2Fv1%2Findex.json?alt=media&token=published-option-results-v1';
(async()=>{try{
 const response=await fetch(url,{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('Results feed HTTP '+response.status);
 const results=await response.json();if(!Array.isArray(results)||results.length>200||results.some(r=>!/^options_results_[A-Z0-9.-]+_\d{4}-\d{2}-\d{2}$/.test(r.id)||!Array.isArray(r.moves)||!r.moves.length||r.images?.length!==r.moves.length||r.recap?.length!==8))throw Error('Invalid results feed');
 const text=JSON.stringify(results,null,2);if(/massive|apiKey|Bearer /i.test(text))throw Error('Unexpected private field in public results');
 fs.writeFileSync('data/option-results.json',text+'\n');console.log('Saved '+results.length+' option result reports');
 }catch(error){console.warn('Keeping saved option results:',error.message);if(!fs.existsSync('data/option-results.json'))process.exitCode=1;}})();
