import EarningsCalendar from '../../components/earnings/EarningsCalendar';
import snapshot from '../../data/earnings-calendar.json';
export default function Page(){return <EarningsCalendar snapshot={snapshot} mode="this-week"/>;}
