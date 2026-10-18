export type Point = [number, number];
export function plotPoints(values: number[]): Point[] {
  if (!values.length || values.some(value => !Number.isFinite(value))) return [];
  const min = Math.min(...values), span = Math.max(...values) - min;
  return values.map((value, index) => [3 + index / Math.max(1, values.length - 1) * 144, span ? 34 - (value - min) / span * 29 : 19.5]);
}
export function linePath(points: Point[]) {
  return points.map(([x,y],index) => `${index?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
}
/** Equal x positions let unlike data lengths interpolate without jumping. */
export function resample(points: Point[], count: number): Point[] {
  if (!points.length || count < 2) return points;
  return Array.from({length:count}, (_,i) => {
    const at = i / (count - 1) * (points.length - 1), left = Math.floor(at), right = Math.min(points.length-1,left+1), mix=at-left;
    return [points[left][0]+(points[right][0]-points[left][0])*mix, points[left][1]+(points[right][1]-points[left][1])*mix];
  });
}
export function blend(from: Point[], to: Point[], progress: number): Point[] {
  return to.map(([x,y],i) => [from[i][0]+(x-from[i][0])*progress, from[i][1]+(y-from[i][1])*progress]);
}
