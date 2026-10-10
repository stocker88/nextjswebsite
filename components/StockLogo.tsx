import FallbackLogo from './FallbackLogo';
export default function StockLogo({symbol,src}:{symbol:string;src:string|null}) {
 return <><span className="stock-logo" aria-hidden="true"><FallbackLogo src={src} width={48} height={48}/></span><style jsx>{`.stock-logo{width:48px;height:48px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;background:#26354c;color:#d3e5ff;font-size:16px;font-weight:700}.stock-logo :global(img){width:48px;height:48px;object-fit:contain;background:white}`}</style></>;
}
