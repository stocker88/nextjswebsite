import ResearchHub from '../index';
import {fetchResearch} from '../../../lib/research-server';
export default ResearchHub;
export function getStaticPaths() {return {paths:[],fallback:'blocking'};}
export async function getStaticProps({params}:{params:{page:string}}) {
  const page = Number(params.page);
  if (!/^\d+$/.test(params.page) || !Number.isSafeInteger(page) || page < 2) return {notFound:true};
  const all = await fetchResearch();
  if ((page-1)*40 >= all.length) return {notFound:true,revalidate:60};
  return {props:{items:all.slice((page-1)*40,page*40),page,total:all.length},revalidate:60};
}
