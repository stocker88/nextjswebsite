import type {ResearchPreview} from './research';
const educationTags=new Set(['education','educational','learning','course','investing','strategy','q&a']);
const marketTags=new Set(['market','markets','macro','economicdata','fed','economy']);
export function categoryOf(item:ResearchPreview):'market'|'education'|'other'{
 const tags=item.symbols.map(tag=>tag.toLowerCase().replace(/^[#$]/,'').trim());
 return tags.some(tag=>educationTags.has(tag))?'education':tags.some(tag=>marketTags.has(tag))?'market':'other';
}
// Distribute each received batch independently so appending never moves old cards.
export function mobileNewsBatch(items:ResearchPreview[]){
 const news=items.filter(item=>categoryOf(item)!=='education');
 const learning=items.filter(item=>categoryOf(item)==='education');
 if(!news.length||!learning.length)return [...items];
 const result:ResearchPreview[]=[];let n=0;
 learning.forEach((item,i)=>{
  const boundary=Math.floor((i+1)*news.length/learning.length);
  while(n<boundary)result.push(news[n++]);
  result.push(item);
 });
 return result;
}
