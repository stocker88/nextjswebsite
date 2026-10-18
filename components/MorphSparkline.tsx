import {useEffect, useRef, useState} from 'react';
import {plotPoints, resample, linePath, blend, Point} from '../lib/chart-morph';

/** Morph only the plot, while keeping dated labels and final data exact. */
export default function MorphSparkline({points}:{points:(string|number)[][]}) {
  const target = plotPoints(points.map(point => Number(point[1])));
  const signature = JSON.stringify(target);
  const [shown, setShown] = useState<Point[]>(target);
  const current = useRef(shown);
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const finish = () => {cancelAnimationFrame(frame); current.current = target; setShown(target);};
    if (reduced.matches || !current.current.length || !target.length || JSON.stringify(current.current) === signature) {finish(); return;}
    const from = resample(current.current, 72), to = resample(target, 72);
    const start = performance.now();
    const step = (now:number) => {
      const progress = Math.min(1, (now - start) / 440);
      if (progress === 1) {finish(); return;}
      current.current = blend(from,to,1-Math.pow(1-progress,3));
      setShown(current.current);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    const preference = () => {if(reduced.matches) finish();};
    reduced.addEventListener('change',preference);
    return () => {cancelAnimationFrame(frame); reduced.removeEventListener('change',preference);};
  }, [signature]);
  return <path d={linePath(shown)} pathLength="1" />;
}
