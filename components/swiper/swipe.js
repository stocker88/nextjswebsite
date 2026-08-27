import Image from 'next/image';

const signalScreenshots = [
  '/assets/images/1.webp',
  '/assets/images/2.webp',
  '/assets/images/3.webp',
];

export default function Swipe() {
  return (
    <section className="signal-screenshots" aria-label="AI trading signal examples">
      {signalScreenshots.map((src, index) => (
        <div className="signal-screenshot" key={src}>
          <Image
            width={543}
            height={478}
            src={src}
            sizes="(max-width: 720px) 92vw, 543px"
            alt={`StocksToBuyNow AI trading signal example ${index + 1}`}
          />
        </div>
      ))}
    </section>
  );
}
