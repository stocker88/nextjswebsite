import {useState} from 'react';
const ROBOT = '/assets/images/stockerRobotIcon.png';
export default function FallbackLogo({src,className,width,height}:{src?:string|null;className?:string;width?:number;height?:number}) {
  const [failed,setFailed] = useState<string[]>([]);
  const primary = src || ROBOT;
  const current = failed.includes(primary) ? ROBOT : primary;
  if (failed.includes(current)) return null;
  return <img src={current} className={className} width={width} height={height} alt="" loading="lazy" onError={()=>setFailed(previous=>[...previous,current])}/>;
}
