// Embed raster assets so exported SVGs do not rely on external image requests.
// Missing assets and CORS failures keep the text/initials fallback usable.
export async function embedPortfolioImages(svg: SVGSVGElement): Promise<SVGSVGElement> {
 const clone=svg.cloneNode(true) as SVGSVGElement;
 await Promise.all(Array.from(clone.querySelectorAll('image')).map(async image=>{
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
  try {
   const response=await fetch(image.getAttribute('href')||'',{signal:controller.signal});
   if(!response.ok)throw Error('Image unavailable');
   const blob=await response.blob();
   if(!/^image\/(png|jpeg|webp)$/.test(blob.type))throw Error('Unsupported image');
   const uri=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(blob)});
   image.setAttribute('href',uri);
  } catch {image.remove()} finally {clearTimeout(timer)}
 }));
 return clone;
}
