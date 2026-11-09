import Image from 'next/image';
import Link from 'next/link';
import { money } from '@/lib/api';
import { Badge, Stars } from './ui';

export function ProductImage({ src, alt, title, className = '' }: { src?: string | null; alt?: string; title: string; className?: string }) {
  if (src) return <Image src={src} alt={alt || title} width={600} height={600} sizes="(max-width:768px) 50vw, 25vw" className={`aspect-square w-full object-cover ${className}`} />;
  return <div role="img" aria-label={`${title} (image coming soon)`} className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br from-plum-soft to-sky-soft font-serif text-5xl text-plum/40 ${className}`}>{title.charAt(0)}</div>;
}

export function ProductCard({ p }: { p: any }) {
  return (
    <Link href={`/products/${p.slug}`} className="card group flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-[0_12px_32px_-12px_rgba(91,42,68,.28)]">
      <div className="overflow-hidden"><ProductImage src={p.image} alt={p.alt} title={p.title} className="transition-transform duration-300 group-hover:scale-[1.03]" /></div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-sm text-muted">{p.brand?.name}</p>
        <h3 className="line-clamp-2 text-base font-medium leading-snug text-ink md:text-base" style={{ fontFamily: 'inherit' }}>{p.title}</h3>
        {p.ratingCount > 0 && <Stars value={p.ratingAvg ?? p.rating} count={p.ratingCount} />}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-2">
          <span className="tnum text-lg font-semibold text-plum">{money(p.price)}</span>
          {p.discountPercent > 0 && <><span className="tnum text-sm text-muted line-through">{money(p.mrp)}</span><span className="text-sm font-medium text-ok">{p.discountPercent}% off</span></>}
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {p.offers > 1 && <Badge tone="plum">{p.offers} sellers</Badge>}
          {p.fragranceFree && <Badge>Fragrance-free</Badge>}
          <Badge>Ships in {p.dispatchDays ?? 2}d</Badge>
        </div>
      </div>
    </Link>
  );
}
