'use client';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { money } from '@/lib/api';

function getDemoImage(title: string, slug?: string, fallbackSrc?: string | null) {
  const s = (slug || title || '').toLowerCase();
  if (s.includes('rose-velvet') || s.includes('lipstick')) return '/demo/rose-velvet-lipstick.jpg';
  if (s.includes('night-renewal') || s.includes('renewal-serum')) return '/demo/night-renewal-serum.jpg';
  if (s.includes('barrier')) return '/demo/barrier-support-cream.jpg';
  if (s.includes('skin-fit') || s.includes('silk-skin') || s.includes('foundation')) return '/demo/skin-fit-serum-foundation.jpg';
  return fallbackSrc || null;
}

export function ProductImage({
  src,
  alt,
  title,
  slug,
  className = '',
}: {
  src?: string | null;
  alt?: string;
  title: string;
  slug?: string;
  className?: string;
}) {
  const finalSrc = getDemoImage(title, slug, src);
  if (finalSrc) {
    return (
      <Image
        src={finalSrc}
        alt={alt || title}
        width={600}
        height={600}
        sizes="(max-width:768px) 50vw, 25vw"
        className={`aspect-square w-full object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${title} (image coming soon)`}
      className={`flex aspect-square w-full items-center justify-center bg-gradient-to-br from-[#FAF0F2] to-[#F2E8EB] font-serif text-5xl text-[#5C0F2E]/30 ${className}`}
    >
      {title.charAt(0)}
    </div>
  );
}

export function ProductCard({ p }: { p: any }) {
  const [wished, setWished] = useState(false);
  const s = (p.slug || p.title || '').toLowerCase();

  // Dynamic tags matching Figma
  const isMatchDemo = s.includes('night-renewal');
  const isNewRelease = s.includes('rose-velvet');
  const discount = p.discountPercent || (p.mrp && p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 17);

  // Tags
  let tags: string[] = [];
  if (s.includes('rose-velvet')) {
    tags = [];
  } else if (s.includes('night-renewal')) {
    tags = ['FRAGRANCE-FREE', 'NIACINAMIDE'];
  } else if (s.includes('barrier')) {
    tags = ['CERAMIDES', 'SENS-APPROVED'];
  } else if (p.fragranceFree) {
    tags = ['FRAGRANCE-FREE'];
  }

  const rating = p.ratingAvg ?? p.rating ?? (s.includes('night-renewal') ? 5.0 : s.includes('barrier') ? 4.8 : 4.9);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#EFE5E8] bg-white transition-all duration-300 hover:shadow-luxury hover:-translate-y-0.5">
      {/* Top Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3F5]">
        <Link href={`/products/${p.slug}`} className="block h-full w-full">
          <ProductImage
            src={p.image}
            alt={p.alt}
            title={p.title}
            slug={p.slug}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top-left badge */}
        <div className="absolute left-2.5 top-2.5 pointer-events-none z-10 flex flex-col gap-1">
          {isMatchDemo ? (
            <span className="rounded bg-[#FCECF0] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7E0A29] shadow-xs">
              SKIN MATCH 98%
            </span>
          ) : isNewRelease ? (
            <span className="rounded bg-[#FAF0E6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6D58] shadow-xs">
              NEW RELEASE
            </span>
          ) : discount > 0 ? (
            <span className="rounded bg-[#FAF0E6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8C6D58] shadow-xs">
              {discount}% OFF
            </span>
          ) : null}
        </div>

        {/* Wishlist toggle */}
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWished(!wished);
          }}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink/70 backdrop-blur shadow-xs hover:text-[#630D2B] transition-colors"
        >
          <Heart size={14} className={wished ? 'fill-[#630D2B] text-[#630D2B]' : ''} />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-3.5">
        {/* Brand row with star rating */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <p className="font-bold uppercase tracking-widest text-[#8A737B] truncate">
            {p.brand?.name || 'AURELIA (DEMO)'}
          </p>
          <div className="flex items-center gap-1 text-ink/80 shrink-0 font-medium text-xs">
            <Star size={11} className="fill-[#C59B56] text-[#C59B56]" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Product title */}
        <Link href={`/products/${p.slug}`} className="mt-1">
          <h3 className="line-clamp-1 font-serif text-[15px] font-bold text-[#24141E] group-hover:text-[#630D2B] transition-colors">
            {p.title.replace(' (Demo)', '')}
          </h3>
        </Link>

        {/* Subtitle / Tags line */}
        <div className="mt-1.5 min-h-[20px] flex flex-wrap items-center gap-1 text-xs">
          {tags.length > 0 ? (
            tags.map((t) => (
              <span key={t} className="rounded bg-[#F6EFF1] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#7A646E]">
                {t}
              </span>
            ))
          ) : (
            <p className="line-clamp-1 text-[11px] text-muted">
              {s.includes('lipstick') ? 'Hydrating botanical oils with plush, matte...' : s.includes('foundation') ? 'Weightless second-skin radiant coverage...' : 'Formulation-first botanical care...'}
            </p>
          )}
        </div>

        {/* Price & dispatch row */}
        <div className="mt-auto pt-3 border-t border-[#F5EBEF] flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="tnum font-bold text-sm md:text-base text-[#5C0F2E]">
              {money(p.price)}
            </span>
            {p.mrp && p.mrp > p.price && (
              <span className="tnum text-xs text-muted line-through">
                {money(p.mrp)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted truncate">
            {p.offers > 1 ? `${p.offers} sellers` : 'Ships in 2d'}
          </p>
        </div>
      </div>
    </div>
  );
}
