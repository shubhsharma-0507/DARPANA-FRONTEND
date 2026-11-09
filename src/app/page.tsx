'use client';
import { ArrowRight, Brush, CreditCard, Droplets, Gift, Hand, RotateCcw, Scissors, ShieldCheck, Sparkles, SprayCan, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ErrorBox, MatchBadge, Skeleton } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { useSiteConfig } from '@/lib/site';

const CATS = [
  { name: 'Skincare', slug: 'skincare', tag: 'Glow Naturally', Icon: Droplets },
  { name: 'Makeup', slug: 'makeup', tag: 'Express Yourself', Icon: Brush },
  { name: 'Fragrances', slug: 'fragrance', tag: 'Smell Amazing', Icon: SprayCan },
  { name: 'Hair Care', slug: 'hair-care', tag: 'Stronger Hair', Icon: Scissors },
  { name: 'Nail Care', slug: 'nail-care', tag: 'Nail it Perfect', Icon: Hand },
  { name: 'Beauty Sets', slug: 'beauty-sets', tag: 'Perfect Combo', Icon: Gift },
];

const HERO_FADE = 'linear-gradient(to right, transparent 0, #000 16%, #000 97%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 10%, #000 88%, transparent 100%)';
const HERO_MASK = { WebkitMaskImage: HERO_FADE, maskImage: HERO_FADE, WebkitMaskComposite: 'source-in', maskComposite: 'intersect' } as React.CSSProperties;

export default function Home() {
  const cfg = useSiteConfig();
  const trending = useFetch<{ items: any[] }>('/products', { sort: 'popular', limit: 8 });
  const fresh = useFetch<{ items: any[] }>('/products', { sort: 'newest', limit: 4 });
  const best = cfg?.offers.length ? Math.max(...cfg.offers.map((o) => o.percent)) : 0;
  const code = cfg?.offers.find((o) => o.percent === best)?.code;
  const trust = [
    [ShieldCheck, 'Verified', 'Sellers'], [Truck, 'Free Shipping', cfg ? `Above ${money(cfg.freeShippingAbove)}` : 'On select orders'],
    [CreditCard, 'Secure', 'Payments'], [RotateCcw, 'Easy', 'Returns'], [Sparkles, 'Skin Match', 'Guidance'],
  ] as const;
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FFE9EC] via-[#FED9DE] to-[#FDC8CF]">
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/50 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-1/3 top-0 h-60 w-60 rounded-full bg-[#FFB8C6]/50 blur-3xl" />
        <div className="container relative grid items-center gap-2 pb-20 pt-10 lg:grid-cols-[1fr_1.15fr] lg:pb-24 lg:pt-14">
          <div className="relative z-10">
            <p className="font-script text-3xl text-coral md:text-4xl">Unleash Your Natural Glow <span aria-hidden>✨</span></p>
            <h1 className="mt-2 text-6xl font-extrabold tracking-tight text-[#3A0A22] sm:text-7xl md:text-[5.5rem] lg:leading-[0.95]">DARPANA</h1>
            <div className="mt-2 flex items-center gap-3" aria-hidden><span className="h-px flex-1 max-w-[70px] bg-coral/70" /><span className="font-serif text-2xl font-medium tracking-[0.55em] text-coral sm:text-3xl">COSMETICS</span><span className="h-px flex-1 max-w-[70px] bg-coral/70" /></div>
            <p className="mt-6 font-serif text-2xl text-[#3A0A22] md:text-3xl">Discover Beauty. Feel <span className="font-script text-4xl text-coral md:text-5xl">Confident.</span></p>
            <p className="mt-4 max-w-md text-[17px] text-ink/80">Premium beauty products for a more beautiful, confident and radiant you, matched to the skin profile you share.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary px-7 shadow-[0_10px_24px_-10px_rgba(187,16,66,.7)]"><ShoppingIcon />Shop Now <ArrowRight size={16} aria-hidden /></Link>
              <Link href="/shade-finder" className="btn border border-coral/50 bg-white/60 px-6 text-coral hover:bg-white"><Sparkles size={16} aria-hidden />Find My Shade</Link>
            </div>
          </div>
          <div className="relative -mx-4 mt-4 lg:mx-0 lg:mt-0">
            <Image src="/home/hero.jpg" alt="A woman with glowing skin surrounded by Darpana perfume, foundation, cream, brushes and a palette" width={967} height={460} priority sizes="(max-width:1024px) 100vw, 60vw" className="h-auto w-full select-none" style={{ ...HERO_MASK }} />
          </div>
        </div>
      </section>

      {/* ---------- Trust strip ---------- */}
      <section className="container relative z-10 -mt-12" aria-label="Why shop with us">
        <ul className="grid grid-cols-2 divide-line rounded-2xl border border-white/80 bg-white/90 py-3 shadow-card backdrop-blur md:grid-cols-5 md:divide-x">
          {trust.map(([Icon, a, b]) => <li key={a} className="flex items-center gap-3 px-4 py-2 md:justify-center"><Icon size={30} strokeWidth={1.6} className="shrink-0 text-coral" aria-hidden /><span className="text-sm leading-tight"><strong className="block font-medium">{a}</strong><span className="text-muted">{b}</span></span></li>)}
        </ul>
      </section>

      {/* ---------- Shop by category ---------- */}
      <section className="container pb-4 pt-14">
        <div className="mb-7 flex items-center justify-center gap-4"><span aria-hidden className="h-px w-12 bg-coral/60 md:w-24" /><h2 className="text-center text-3xl md:text-4xl">Shop <span className="font-script text-4xl font-normal text-coral md:text-5xl">by Category</span></h2><span aria-hidden className="h-px w-12 bg-coral/60 md:w-24" /></div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {CATS.map(({ name, slug, tag, Icon }) => (
            <li key={slug}>
              <Link href={`/products?category=${slug}`} className="group relative flex h-[118px] overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-r from-[#FFE3E6] to-[#FDD0D4] shadow-card transition-transform duration-200 hover:-translate-y-0.5">
                <Image src={`/home/cat-${slug}.jpg`} alt="" width={332} height={236} className="h-full w-[48%] object-cover" style={{ WebkitMaskImage: 'linear-gradient(to right, #000 62%, transparent 100%)', maskImage: 'linear-gradient(to right, #000 62%, transparent 100%)' }} />
                <span className="flex flex-1 flex-col items-center justify-center gap-0.5 pr-2 text-center"><Icon size={22} strokeWidth={1.6} className="text-coral" aria-hidden /><strong className="text-[15px] font-semibold text-ink">{name}</strong><span className="inline-flex items-center gap-1 text-[11px] text-muted">{tag} <ArrowRight size={11} aria-hidden className="transition-transform group-hover:translate-x-0.5" /></span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Special offers ---------- */}
      <section className="container py-8" aria-label="Special offers">
        <div className="relative grid items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-[#7E0A29] via-[#6A0C28] to-[#5C1227] px-6 py-8 text-white md:grid-cols-[1.1fr_auto_1.2fr_auto] md:px-12 md:py-6">
          <div><p className="whitespace-nowrap font-script text-5xl leading-none text-white md:text-6xl">Special Offers</p><p className="mt-1 text-sm text-white/85">Look Beautiful, Save More!</p></div>
          <span aria-hidden className="hidden h-16 w-px bg-white/30 md:block" />
          <div>{best > 0 ? <><p className="text-sm tracking-[0.2em] text-white/80">UP TO</p><p className="font-serif text-5xl font-extrabold leading-none text-gold md:text-6xl">{best}% <span className="text-4xl md:text-5xl">OFF</span></p>{code && <p className="mt-2 text-sm text-white/80">Use code <strong className="tnum rounded bg-white/15 px-2 py-0.5 tracking-wider text-white">{code}</strong></p>}</> : <p className="font-serif text-3xl text-gold">New offers are on the way</p>}</div>
          <div className="flex items-center justify-between gap-4 md:justify-end">
            <Link href="/offers" className="btn bg-gradient-to-b from-[#F3CE96] to-[#DDA85C] px-6 font-semibold text-[#4A0A25] shadow-[0_8px_20px_-8px_rgba(0,0,0,.5)] hover:brightness-105">Grab the Deal <ArrowRight size={16} aria-hidden /></Link>
            <Image src="/home/gifts.jpg" alt="" width={870} height={258} className="hidden h-24 w-auto xl:block" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, #000 25%)', maskImage: 'linear-gradient(to right, transparent, #000 25%)' }} />
          </div>
        </div>
      </section>

      {/* ---------- Products ---------- */}
      <section className="container pb-6 pt-8"><div className="flex items-end justify-between"><h2>Popular right now</h2><Link href="/products?sort=popular" className="text-sm text-coral underline">See all</Link></div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {trending.loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
          {trending.data?.items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {trending.error && <ErrorBox message={trending.error} onRetry={trending.reload} />}
        {trending.data && trending.data.items.length === 0 && <p className="rounded-xl bg-white p-6 text-muted">Products from approved sellers will appear here.</p>}
      </section>

      {/* ---------- Skin Match ---------- */}
      <section className="container py-12"><div className="grid items-center gap-8 rounded-3xl bg-blush-soft p-6 md:grid-cols-2 md:p-10">
        <div><p className="font-script text-3xl text-coral">Only at Darpana</p><h2 className="mt-1">Know why it suits you, before you buy it.</h2><p className="mt-3 text-muted">Tell us your skin type, concerns and what to avoid. Every product page explains how well it fits, which ingredients matter, and what to watch for. Optional, private, and never shared with sellers.</p><Link href="/account/skin-profile" className="btn-primary mt-5">Build my skin profile</Link></div>
        <div className="card mx-auto w-full max-w-sm p-5" aria-label="Example of a Skin Match result"><p className="mb-3 text-xs text-muted">Example result</p>
          <div className="flex items-center gap-4"><Image src="/icon.png" alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-xl bg-ivory object-contain p-1" /><div><p className="font-medium">Silk Skin Foundation</p><MatchBadge level="good" score={74} /></div></div>
          <ul className="mt-4 space-y-2 text-sm"><li className="flex gap-2"><span className="text-ok" aria-hidden>✓</span>Suitable for dry skin</li><li className="flex gap-2"><span className="text-ok" aria-hidden>✓</span>No fragrance on the ingredient list</li><li className="flex gap-2"><span className="text-warn" aria-hidden>!</span>Not enough reviews from similar skin yet</li></ul>
          <p className="mt-4 border-t border-line pt-3 text-xs text-muted">Based on what you shared and the listed ingredients. Not medical advice.</p></div>
      </div></section>

      <section className="container pb-6"><h2 className="text-center">How Skin Match works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {[['Tell us about your skin', 'A short quiz. Sensitive questions are optional and have their own consent.'], ['We compare it to the ingredients', 'Fixed, reviewable rules check your profile against each product’s full ingredient list. No guesswork from AI.'], ['You see the reasons', 'A level, a confidence label, and plain-language reasons and warnings on every product page.']].map(([t, d], i) => <li key={t} className="card p-6"><span className="font-serif text-3xl text-rose" aria-hidden>{i + 1}</span><h3 className="mt-2 text-lg">{t}</h3><p className="mt-1 text-muted">{d}</p></li>)}
        </ol></section>

      <section className="container py-10"><div className="grid gap-6 overflow-hidden rounded-3xl bg-burgundy p-8 text-white md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div><h2 className="!text-white">Foundation shades, without the guesswork</h2><p className="mt-3 max-w-xl text-white/80">Answer a few questions about undertone and depth, or tell us a shade that already works. We suggest three close matches across brands, with a confidence label. No camera needed.</p></div>
        <Link href="/shade-finder" className="btn bg-white text-plum hover:bg-blush-soft">Find my shade</Link></div></section>

      {fresh.data && fresh.data.items.length > 0 && <section className="container pb-6"><h2>New arrivals</h2><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{fresh.data.items.map((p) => <ProductCard key={p.id} p={p} />)}</div></section>}
    </>
  );
}

function ShoppingIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>; }
