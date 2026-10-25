import SmartMoneyHub from '../../components/SmartMoneyHub';
import {smartMoneyProps} from '../../lib/smart-money-page';
export default SmartMoneyHub;
export const getStaticProps=()=>smartMoneyProps('politicians');
