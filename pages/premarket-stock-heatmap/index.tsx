import ExtendedHoursPage from '../../components/ExtendedHoursPage';
import {ExtendedSession} from '../../lib/extended-hours';
import {loadExtendedSession} from '../../lib/extended-hours-server';
export default function Page({snapshot}:{snapshot:ExtendedSession|null}){return <ExtendedHoursPage initial={snapshot} kind="preMarket"/>;}
export async function getStaticProps(){return {props:{snapshot:await loadExtendedSession('preMarket')},revalidate:300};}
