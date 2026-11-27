import TradingToolsHub from '../../components/TradingToolsHub';
import {getStaticProps as englishProps} from '../trading-tools';
import messages from '../../data/localization/es-ui.json';
export default TradingToolsHub;
export function getStaticProps(){
 const {props}=englishProps();
 const t=(s:string)=>(messages as Record<string,string>)[s]||s;
 return {props:{...props,title:t(props.title),description:t(props.description),path:'/es/trading-tools/',items:props.items.map(item=>({...item,name:t(item.name),detail:'detail' in item&&item.detail?t(item.detail).replace(/(\d+) stocks with price history/,'$1 acciones con historial de precios').replace(/(\d+) pairs with matching historical dates/,'$1 pares con fechas históricas coincidentes').replace(/(\d+) assets/,'$1 activos').replace(/(\d+) pairs/,'$1 pares'):null}))}};
}
