import {getServerSideProps as sitemap} from '../sitemap.xml';
export default function SitemapPart(){return null}
export async function getServerSideProps(context:any){return sitemap({...context,sitemapPart:context.params.part})}
