import ExtendedHoursPage from '../../components/ExtendedHoursPage';
import {ExtendedSession} from '../../lib/extended-hours';
import {loadExtendedSession} from '../../lib/extended-hours-server';
export default function Page({snapshot}:{snapshot:ExtendedSession|null}){return <ExtendedHoursPage initial={snapshot} kind="afterHours"/>;}
export async function getStaticProps(){return {props:{snapshot:await loadExtendedSession('afterHours')},revalidate:300};}
