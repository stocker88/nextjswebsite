import CryptoDirectory from '../../components/CryptoDirectory';
import {toolAssets,cryptoLogo} from '../../lib/seo-tools-server';
import {assetPath} from '../../lib/seo-tools';
export default CryptoDirectory;
export function getStaticProps(){return {props:{items:toolAssets().filter(a=>a.kind==='crypto').map(a=>{const points=a.points.slice(-30);return {symbol:a.symbol,name:a.name,path:assetPath(a),logo:cryptoLogo(a.symbol),price:points.at(-1)![1],date:points.at(-1)![0],fresh:Date.now()-Date.parse(points.at(-1)![0]+'T23:59:59Z')<=14*86400000,change:(points.at(-1)![1]/points[0][1]-1)*100,points};})}};}
