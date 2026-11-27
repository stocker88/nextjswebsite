import type {Certificate} from './academy';
const escapeXml=(value:string)=>value.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]!));
export function certificateSvg(c:Certificate){
 const name=c.name.trim();
 const size=Math.min(62,1100/Math.max(Array.from(name).length*.56,1));
 const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(c.issuedAt));
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="990" viewBox="0 0 1400 990" role="img" aria-label="Certificate of Completion for ${escapeXml(name)}">
 <rect width="1400" height="990" fill="#fbfaf6"/>
 <rect x="32" y="32" width="1336" height="926" fill="none" stroke="#142b40" stroke-width="2"/>
 <rect x="44" y="44" width="1312" height="902" fill="none" stroke="#b49a62"/>
 <path d="M32 124V32h92M1276 32h92v92M1368 866v92h-92M124 958H32v-92" fill="none" stroke="#b49a62" stroke-width="5"/>
 <g text-anchor="middle" fill="#142b40">
 <text x="700" y="119" font-family="Arial,sans-serif" font-size="23" letter-spacing="3">STOCKS TO BUY NOW RESEARCH</text>
 <text x="700" y="161" font-family="Arial,sans-serif" font-size="14" letter-spacing="5" fill="#6c747a">INVESTOR ACADEMY</text>
 <path d="M600 198h200" stroke="#b49a62" stroke-width="2"/>
 <text x="700" y="290" font-family="Georgia,serif" font-size="67">Certificate of Completion</text>
 <text x="700" y="342" font-family="Arial,sans-serif" font-size="17" letter-spacing="4" fill="#786139">LEVEL 1 · INVESTING FOUNDATIONS</text>
 <text x="700" y="420" font-family="Georgia,serif" font-style="italic" font-size="25" fill="#6c747a">Presented to</text>
 <text x="700" y="501" font-family="Georgia,serif" font-size="${size}">${escapeXml(name)}</text>
 <path d="M300 536h800" stroke="#d5c8aa"/>
 <text x="700" y="593" font-family="Arial,sans-serif" font-size="23">For completing all eight Level 1 learning sections</text>
 <text x="700" y="628" font-family="Arial,sans-serif" font-size="23">and successfully passing the required assessments.</text>
 <text x="700" y="679" font-family="Arial,sans-serif" font-size="16" fill="#6c747a">Portfolio allocation · Stock analysis · Trading signals · Risk · Options · Macro events</text>
 <circle cx="700" cy="804" r="57" fill="none" stroke="#b49a62" stroke-width="2"/>
 <circle cx="700" cy="804" r="49" fill="none" stroke="#d5c8aa"/>
 <text x="700" y="811" font-family="Georgia,serif" font-size="35">I</text>
 <text x="700" y="833" font-family="Arial,sans-serif" font-size="9" letter-spacing="2">COMPLETED</text>
 <text x="292" y="783" font-family="Arial,sans-serif" font-size="12" letter-spacing="2" fill="#6c747a">DATE OF COMPLETION</text>
 <text x="292" y="818" font-family="Georgia,serif" font-size="23">${escapeXml(date)}</text>
 <text x="1100" y="783" font-family="Arial,sans-serif" font-size="12" letter-spacing="2" fill="#6c747a">ISSUED BY</text>
 <text x="1100" y="818" font-family="Georgia,serif" font-size="22">Stocks to Buy Now Research</text>
 <text x="700" y="899" font-family="Arial,sans-serif" font-size="12" fill="#6c747a">Certificate ID: ${escapeXml(c.id)}</text>
 <text x="700" y="924" font-family="Arial,sans-serif" font-size="12" fill="#6c747a">www.stockstobuynow.ai/learn/get-certified/</text>
 </g></svg>`;
}
export function certificatePrintDocument(c:Certificate){
 return `<!doctype html><html><head><meta charset="utf-8"><title>Investor Academy Certificate</title><style>@page{size:A4 landscape;margin:0}html,body{margin:0;padding:0;background:#fbfaf6}svg{display:block;width:297mm;height:210mm;max-width:100%;}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{html,body{width:297mm;height:210mm;overflow:hidden}svg{max-width:none;break-inside:avoid}}</style></head><body>${certificateSvg(c)}</body></html>`;
}
export function printCertificate(c:Certificate){
 // Isolate printing from the long academy page: no hidden content, headers or blank pages.
 const frame=document.createElement('iframe');
 frame.title='Print Investor Academy certificate';
 frame.style.cssText='position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
 frame.onload=()=>{const win=frame.contentWindow;if(!win)return;
  win.addEventListener('afterprint',()=>frame.remove(),{once:true});
  win.focus();win.print();
 };
 frame.srcdoc=certificatePrintDocument(c);document.body.appendChild(frame);
}
export async function downloadCertificate(c:Certificate){
 const source=URL.createObjectURL(new Blob([certificateSvg(c)],{type:'image/svg+xml'}));
 try{
  const image=new Image();
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error('Could not prepare the certificate image. Please retry.'));image.src=source;});
  const canvas=document.createElement('canvas');canvas.width=2800;canvas.height=1980;
  const context=canvas.getContext('2d');if(!context)throw new Error('Image downloads are unavailable in this browser. Please use Print / save as PDF.');
  context.fillStyle='#fbfaf6';context.fillRect(0,0,canvas.width,canvas.height);
  context.drawImage(image,0,0,canvas.width,canvas.height);
  const jpeg=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create the JPEG. Please retry.')),'image/jpeg',0.95));
  const url=URL.createObjectURL(jpeg);
  const a=document.createElement('a');a.href=url;a.download='Investor-Academy-Level-1.jpg';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
 }finally{URL.revokeObjectURL(source);}
}
