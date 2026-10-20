/** Only compare consecutive daily observations; never label a data gap 1D. */
export function dailyPreviewChange(row: {id: string; yieldRate: boolean; points: (string | number)[][]}): number | null {
  if (row.points.length < 2) return null;
  const [previous, latest] = row.points.slice(-2);
  const start = new Date(String(previous[0]) + 'T12:00:00Z');
  const end = new Date(String(latest[0]) + 'T12:00:00Z');
  const days = (end.getTime() - start.getTime()) / 86400000;
  const adjacent = days === 1 || (!row.id.endsWith('-USD') && days === 3 && start.getUTCDay() === 5 && end.getUTCDay() === 1);
  const before = Number(previous[1]), after = Number(latest[1]);
  if (!adjacent || !Number.isFinite(before) || !Number.isFinite(after) || before <= 0) return null;
  return row.yieldRate ? (after - before) * 100 : (after / before - 1) * 100;
}
