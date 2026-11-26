'use client';
import {
  ArrowRight,
  Check,
  CreditCard,
  Info,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Wand2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ErrorBox, Skeleton } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { useSiteConfig } from '@/lib/site';

const CATEGORIES = [
  { name: 'Skincare', slug: 'skincare', tag: 'Glow Naturally', img: '/home/cat-skincare.jpg' },
  { name: 'Makeup', slug: 'makeup', tag: 'Express Yourself', img: '/home/cat-makeup.jpg' },
  { name: 'Fragrances', slug: 'fragrance', tag: 'Smell Amazing', img: '/home/cat-fragrance.jpg' },
  { name: 'Hair Care', slug: 'hair-care', tag: 'Stronger Hair', img: '/home/cat-hair-care.jpg' },
  { name: 'Nail Care', slug: 'nail-care', tag: 'Nail It Perfect', img: '/home/cat-nail-care.jpg' },
  { name: 'Beauty Sets', slug: 'beauty-sets', tag: 'Perfect Combo', img: '/home/cat-beauty-sets.jpg' },
];

export default function Home() {
  const cfg = useSiteConfig();
  const trending = useFetch<{ items: any[] }>('/products', { sort: 'popular', limit: 4 });
  const fresh = useFetch<{ items: any[] }>('/products', { sort: 'newest', limit: 4 });

  const trustBadges = [
    { title: 'VERIFIED', subtitle: 'Sellers Only', Icon: ShieldCheck },
    { title: 'FREE SHIP', subtitle: cfg ? `Above ${money(cfg.freeShippingAbove)}` : 'Above ₹999', Icon: Truck },
    { title: 'SECURE', subtitle: 'Payments', Icon: CreditCard },
    { title: 'EASY', subtitle: 'Returns', Icon: RotateCcw },
    { title: 'SKIN MATCH', subtitle: 'Algorithmic Fit', Icon: Sparkles },
  ];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F6] via-[#FFF8F9] to-[#FAF4F6] pt-6 sm:pt-8 pb-12 sm:pb-16 lg:pt-14 lg:pb-24 border-b border-[#F0E5E8]">
        <div className="container relative">
          <div className="grid items-center gap-8 lg:gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Left Copy */}
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
                <Sparkles size={14} className="text-[#C59B56]" />
                <span>UNLEASH YOUR NATURAL GLOW</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#3A0A1F] leading-[1.1]">
                Discover Beauty.
                <br />
                Feel Confident.
              </h1>

              <p className="max-w-xl text-xs sm:text-sm md:text-base text-[#6B555E] leading-relaxed">
                Curated, formulation-first beauty engineered for discernment. High-potency skincare, exquisite color palettes, and certified botanicals matched precisely to your personal skin profile.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="rounded-full bg-[#630D2B] px-6 sm:px-7 py-3 text-xs md:text-sm font-semibold tracking-wider uppercase text-white shadow-md hover:bg-[#4E0A22] transition-colors inline-flex items-center justify-center gap-2 text-center"
                >
                  <span>SHOP VERIFIED COLLECTION</span>
                  <ArrowRight size={15} />
                </Link>
                <Link
                  href="/shade-finder"
                  className="rounded-full border border-[#5C0F2E]/30 bg-white/70 px-5 sm:px-6 py-3 text-xs md:text-sm font-semibold tracking-wider uppercase text-[#5C0F2E] hover:bg-white transition-colors inline-flex items-center justify-center gap-2 text-center"
                >
                  <Sparkles size={15} className="text-[#C59B56]" />
                  <span>FIND MY SHADE</span>
                </Link>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative h-[320px] sm:h-[420px] md:h-[480px] lg:h-[520px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-luxury bg-[#FAF0F2] border border-white">
                <Image
                  src="/home/hero-portrait.jpg"
                  alt="Radiant smiling woman with Atelier Botanical Formulation"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-top select-none"
                />

                {/* Top Right Certificate Tag */}
                <div className="absolute right-3 top-3 sm:right-4 sm:top-4 z-10 rounded-xl bg-[#FAF1E6]/95 px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-md border border-[#F0E0D0]/80 backdrop-blur-xs">
                  <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[#8C6D58] text-center leading-tight">
                    SKIN MATCH
                    <br />
                    <span className="text-[9px] sm:text-[10px] text-[#5C0F2E]">CERTIFIED STANDARD</span>
                  </p>
                </div>

                {/* Floating Bottom Card */}
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 z-10 rounded-xl sm:rounded-2xl bg-white/95 p-2.5 sm:p-3.5 shadow-md backdrop-blur border border-white/80 flex items-center justify-between gap-2.5 sm:gap-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#FCECF0] text-[#630D2B]">
                      <Sparkles size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif text-xs md:text-sm font-bold text-[#3A0A1F] leading-snug truncate">
                        Atelier Botanical Formulation
                      </p>
                      <p className="text-[9px] sm:text-[10px] md:text-[11px] text-[#7A646E] truncate">
                        100% Certified Ethical Chemistry
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-[#FAF3E8] px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#C59B56] shrink-0">
                    IN FOCUS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Strip */}
          <div className="mt-8 sm:mt-12 rounded-2xl border border-[#F0E5E8] bg-white/90 p-3 sm:p-4 shadow-sm backdrop-blur">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#F0E5E8]">
              {trustBadges.map(({ title, subtitle, Icon }, idx) => (
                <div
                  key={title}
                  className={`flex items-center gap-2.5 sm:gap-3 px-2 sm:px-3 py-2 ${
                    idx === 4 ? 'col-span-2 sm:col-span-1 border-t sm:border-t-0' : idx > 0 && idx < 2 ? 'border-t-0' : ''
                  }`}
                >
                  <Icon size={20} className="text-[#630D2B] shrink-0 sm:w-6 sm:h-6" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <strong className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#3A0A1F] truncate">
                      {title}
                    </strong>
                    <span className="text-[11px] sm:text-xs text-[#7A646E] truncate block">{subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. DISCOVERY PORTALS / SHOP BY CATEGORY ---------------- */}
      <section className="container">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
              DISCOVERY PORTALS
            </p>
            <h2 className="mt-1 font-serif text-3xl md:text-4xl font-bold text-[#3A0A1F]">
              Shop by Category
            </h2>
          </div>
          <p className="text-xs md:text-sm text-[#7A646E] max-w-md md:text-right leading-relaxed">
            Hand-vetted selections categorized by physical skin interaction, bioactive compounds, and sensory depth.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map(({ name, slug, tag, img }) => (
            <Link
              key={slug}
              href={`/products?category=${slug}`}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-[#EFE5E8] shadow-sm transition-all duration-300 hover:shadow-luxury hover:-translate-y-1 flex flex-col aspect-[3/4]"
            >
              <div className="relative h-full w-full overflow-hidden bg-[#FAF3F5]">
                <Image
                  src={img}
                  alt={name}
                  width={200}
                  height={260}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3 text-white">
                  <strong className="block font-serif text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-[#F3CE96] transition-colors leading-tight">
                    {name}
                  </strong>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-white/80 font-medium">
                    {tag}
                    <ArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- 3. SPECIAL OFFERS BANNER ---------------- */}
      <section className="container">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#4A0A1D] via-[#630E29] to-[#45091A] p-5 sm:p-8 md:p-10 lg:p-12 text-white shadow-xl">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="relative z-10 grid items-center gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-2.5 sm:space-y-3">
              <span className="inline-block rounded-full border border-[#C59B56]/50 bg-[#3A0615]/80 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-[#EABE81]">
                LIMITED SANCTUARY PRIVILEGE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Special Offers
              </h2>
              <p className="font-serif italic text-base sm:text-lg md:text-xl text-white/90">
                Look Beautiful, Save More!
              </p>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed pt-1">
                Enjoy verified purity and dermatological formulations with complimentary courier privilege on your inaugural atelier order.
              </p>
            </div>

            {/* Privilege Card Box */}
            <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  PRIVILEGE CODE
                </p>
                <p className="font-serif text-2xl font-bold text-[#F3CE96]">
                  10% OFF
                </p>
                <p className="text-xs text-white/90">
                  Use code: <strong className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-white">WELCOME10</strong>
                </p>
              </div>

              <Link
                href="/offers"
                className="w-full sm:w-auto rounded-full bg-[#FAF3E8] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#4A0A1D] shadow-sm hover:bg-white transition-colors shrink-0 inline-flex items-center justify-center gap-1.5 text-center"
              >
                <span>GRAB THE DEAL</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. POPULAR RIGHT NOW ---------------- */}
      <section className="container">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
              DERMATOLOGIST &amp; COMMUNITY APPROVED
            </p>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-[#3A0A1F]">
              Popular Right Now
            </h2>
          </div>
          <Link
            href="/products?sort=popular"
            className="text-xs font-bold uppercase tracking-wider text-[#630D2B] hover:underline inline-flex items-center gap-1"
          >
            VIEW ALL FORMULATIONS <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {trending.loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 sm:h-80" />)}
          {trending.data?.items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        {trending.error && <ErrorBox message={trending.error} onRetry={trending.reload} />}
      </section>

      {/* ---------------- 5. SKIN PROFILE / ONLY AT DARPANA ---------------- */}
      <section className="container">
        <div className="rounded-2xl sm:rounded-3xl border border-[#F2E8EB] bg-[#FFF5F7] p-5 sm:p-8 md:p-10 lg:p-12">
          <div className="grid items-center gap-8 lg:gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Left */}
            <div className="space-y-3.5 sm:space-y-4">
              <p className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#7E0A29]">
                <span>🧪</span> ONLY AT DARPANA
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A0A1F] leading-tight">
                Know why it suits you,
                <br />
                before you buy it.
              </h2>
              <p className="text-xs sm:text-sm text-[#6B555E] max-w-lg leading-relaxed">
                Tell us your skin type, concerns and what to avoid. Every product page explains how well it fits, which ingredients matter, and what to watch for. Optional, private, and never shared with sellers.
              </p>
              <div className="pt-2">
                <Link
                  href="/account/skin-profile"
                  className="rounded-full bg-[#630D2B] px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#4E0A22] transition-colors inline-flex items-center justify-center gap-2 text-center w-full sm:w-auto"
                >
                  <span>BUILD MY SKIN PROFILE</span>
                  <span>⊕</span>
                </Link>
                <p className="mt-2 text-[10px] sm:text-[11px] text-[#8C7680] italic">
                  Deterministic rule-based analysis. Zero data reselling. Revoke anytime.
                </p>
              </div>
            </div>

            {/* Right Live Diagnostic Preview Card */}
            <div className="rounded-2xl border border-[#EFE5E8] bg-white p-4 sm:p-6 shadow-luxury space-y-3.5 sm:space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#F5EBF0] pb-3">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted">
                  LIVE DIAGNOSTIC PREVIEW
                </span>
                <span className="rounded-full bg-[#EAF5EF] px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-[#26734E] inline-flex items-center gap-1">
                  <Check size={12} strokeWidth={2.5} /> Good match · 74
                </span>
              </div>

              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#3A0A1F]">
                  Silk Skin Foundation
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs">
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EAF5EF] text-[#26734E] text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-[#24141E]">Suitable for dry skin</strong>
                    <p className="text-[11px] text-muted">Contains squalane and jojoba to reinforce lipid moisture layers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EAF5EF] text-[#26734E] text-[10px] font-bold mt-0.5">
                    ✓
                  </span>
                  <div>
                    <strong className="text-[#24141E]">No fragrance on the ingredient list</strong>
                    <p className="text-[11px] text-muted">Zero synthetic odor masking compounds detected.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#FAF3E8] text-[#C59B56] text-[10px] font-bold mt-0.5">
                    <Info size={10} />
                  </span>
                  <div>
                    <strong className="text-[#24141E]">Confidence Note</strong>
                    <p className="text-[11px] text-muted">Not enough reviews from identical skin profiles yet.</p>
                  </div>
                </li>
              </ul>

              <p className="border-t border-[#F5EBF0] pt-3 text-[10px] sm:text-[11px] text-[#8C7680] italic">
                Based on what you shared and the listed ingredients. Not medical advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 6. HOW SKIN MATCH WORKS ---------------- */}
      <section className="container">
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
            TRANSPARENT METHODOLOGY
          </p>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#3A0A1F]">
            How Skin Match Works
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Tell us about your skin',
              desc: 'A brief, respectful diagnostic quiz. Sensitive questions are completely optional and hold separate privacy consents.',
            },
            {
              step: '02',
              title: 'We compare it to ingredients',
              desc: "Fixed, reviewable rules compare your profile against every formulation's full INCI list. No black-box AI guesswork.",
            },
            {
              step: '03',
              title: 'You see clear reasons',
              desc: 'Every single product card provides transparent match levels, ingredient warnings, and plain-language insights.',
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-2xl border border-[#EFE5E8] bg-white p-5 sm:p-6 md:p-8 shadow-sm space-y-2.5 sm:space-y-3"
            >
              <span className="font-serif text-2xl sm:text-3xl font-light text-[#D1486E]/40" aria-hidden>
                {step}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#3A0A1F]">{title}</h3>
              <p className="text-xs sm:text-sm text-[#6B555E] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 7. DIGITAL SHADE MIRROR ---------------- */}
      <section className="container">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#5C0F2E] p-6 sm:p-8 md:p-12 text-white shadow-xl">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div className="space-y-2.5 max-w-2xl">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                ✣ DIGITAL SHADE MIRROR
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
                Foundation shades, without the guesswork.
              </h2>
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-1">
                Answer a few questions about undertone and depth, or tell us a shade that already works for you. We suggest three close matches across brands, with a confidence label. No camera or invasive scanning needed.
              </p>
            </div>

            <Link
              href="/shade-finder"
              className="w-full sm:w-auto rounded-full bg-[#FAF3E8] px-6 sm:px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#4A0A1D] shadow-sm hover:bg-white transition-colors shrink-0 inline-flex items-center justify-center gap-2 whitespace-nowrap self-start lg:self-center text-center"
            >
              <span>FIND MY SHADE</span>
              <Wand2 size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 8. NEW ARRIVALS ---------------- */}
      <section className="container pb-12">
        <div className="mb-5 sm:mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
              FRESH FROM INDEPENDENT LABORATORIES
            </p>
            <h2 className="mt-1 font-serif text-2xl md:text-3xl font-bold text-[#3A0A1F]">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="text-xs font-bold uppercase tracking-wider text-[#630D2B] hover:underline inline-flex items-center gap-1"
          >
            EXPLORE ALL NEW <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {fresh.loading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 sm:h-80" />)}
          {fresh.data?.items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
