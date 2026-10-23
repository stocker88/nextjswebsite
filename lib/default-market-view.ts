import closedDates from '../data/market-closed-dates.json';

export type DefaultMarketView = 'day' | 'preMarket' | 'afterHours';
export type MarketOverviewView = DefaultMarketView | 'week' | 'month' | 'year';
const closed = new Set(closedDates);
const calendarYears = new Set(closedDates.map(date => date.slice(0,4)));
const eastern = new Intl.DateTimeFormat('en-CA', {timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});

/** Session selection uses the exchange timezone, independently of the visitor. */
export function defaultMarketView(now: number): DefaultMarketView {
  const parts = Object.fromEntries(eastern.formatToParts(now).map(p => [p.type,p.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const day = new Date(date+'T12:00:00Z');
  // Unknown calendar years fall back to the dated regular-session view.
  if (!calendarYears.has(parts.year) || closed.has(date) || [0,6].includes(day.getUTCDay())) return 'day';
  const minute = Number(parts.hour)*60+Number(parts.minute);
  if (minute >= 240 && minute < 570) return 'preMarket';
  const month = day.getUTCMonth(), dom = day.getUTCDate();
  const early = (month===10 && day.getUTCDay()===5 && dom>=23 && dom<=29) || (month===11 && dom===24) || (month===6 && dom===3);
  const close = early ? 780 : 960;
  const extendedClose = early ? 1020 : 1200;
  return minute >= close && minute < extendedClose ? 'afterHours' : 'day';
}
