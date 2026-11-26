import { ArrowRight, Compass, FlaskConical, Shield, ShieldCheck, Sparkles, Sun, Timer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Beauty Tips & Journal – Essential Daily Wisdom',
  description: 'Practical, dermatologically grounded beauty guidance to make smarter, kinder choices for your skin barrier.',
};

export default function BeautyTipsPage() {
  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F6] via-[#FFF8F9] to-[#FAF4F6] pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-[#F0E5E8]">
        <div className="container relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Left Column */}
            <div className="space-y-5">
              <p className="font-serif italic text-base text-[#8C2449] tracking-wide">
                The Darpana Journal
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3A0A1F] leading-[1.08]">
                Little things that help.
              </h1>

              <p className="max-w-xl text-sm sm:text-base text-[#6B555E] leading-relaxed">
                Practical beauty guidance to make smarter, kinder choices for your skin.
              </p>

              {/* Core Philosophy Box */}
              <div className="rounded-2xl border border-[#F0E5E8] bg-white/90 p-5 shadow-sm space-y-2.5 max-w-lg backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C59B56]">
                    CORE PHILOSOPHY
                  </span>
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-[#8C747E]">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck size={12} className="text-[#26734E]" /> Dermatological Rigor
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Timer size={12} /> 5 Min Read
                    </span>
                  </div>
                </div>
                <p className="font-serif text-base sm:text-lg font-bold text-[#3A0A1F]">
                  Health &amp; safety first. Everything else second.
                </p>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative h-[320px] sm:h-[380px] w-full overflow-hidden rounded-3xl shadow-luxury bg-[#FAF0F2] border border-white">
                <Image
                  src="/tips/hero-tips.jpg"
                  alt="Aesthetic skincare bottles on textured linen"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="rounded-full bg-black/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur border border-white/20">
                    RITUAL &amp; FORMULATION
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. SECTION TITLE ---------------- */}
      <section className="container text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
          FOUNDATIONAL WISDOM
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A0A1F]">
          Essential Daily Wisdom
        </h2>
        <p className="text-xs md:text-sm text-[#7A646E] max-w-xl mx-auto leading-relaxed">
          Simple, mindful practices crafted to preserve your skin barrier and enhance your natural radiance over time.
        </p>
      </section>

      {/* ---------------- 3. WISDOM CARDS ---------------- */}
      <section className="container max-w-5xl space-y-8">
        {/* Card 01: Patch-test first */}
        <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-luxury">
          <div className="grid items-center gap-6 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF3F5]">
              <Image
                src="/tips/tip-patch-test.jpg"
                alt="Woman gently touching skin"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover object-top"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#7E0A29] backdrop-blur shadow-xs">
                PRE-APPLICATION
              </span>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A67C39]">
                01 PRE-APPLICATION RITUAL
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A0A1F]">
                Patch-test first.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B555E] leading-relaxed">
                Test new products on a small area, like behind the ear or inner forearm, and wait 24 hours before using on your face. You can see if you notice irritation.
              </p>
              <div className="rounded-xl border border-[#F7DDE3] bg-[#FDF4F6] p-3.5 text-xs text-[#5C0F2E] space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <FlaskConical size={13} /> Atelier Protocol:
                </p>
                <p className="text-[#6B555E] leading-relaxed">
                  Dab an 18-gauge droplet on clean forearm skin; observe for erythema or pruritus across 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 02: Read the full ingredient list */}
        <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-luxury">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_280px]">
            <div className="space-y-3 order-2 md:order-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A67C39]">
                02 INGREDIENT CONSCIOUSNESS
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A0A1F]">
                Read the full ingredient list.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B555E] leading-relaxed">
                Check the top 5 for anything you already know you avoid. Our product pages show the full list and flag common irritants automatically.
              </p>
              <Link
                href="/allergen-guard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#630D2B] hover:underline pt-1"
              >
                <Sparkles size={13} className="text-[#C59B56]" />
                <span>Screen formulations with our Allergen Guard →</span>
              </Link>
            </div>
            <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF3F5] order-1 md:order-2">
              <Image
                src="/tips/tip-ingredients.jpg"
                alt="Apothecary ingredients and dropper"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover object-center"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#7E0A29] backdrop-blur shadow-xs">
                FORMULATION AUDIT
              </span>
            </div>
          </div>
        </div>

        {/* Card 03: Find your foundation by undertone and depth */}
        <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-luxury">
          <div className="grid items-center gap-6 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF3F5]">
              <Image
                src="/tips/tip-shades.jpg"
                alt="Foundation shade swatches"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover object-center"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#7E0A29] backdrop-blur shadow-xs">
                COMPLEXION HARMONY
              </span>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A67C39]">
                03 COMPLEXION HARMONY
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A0A1F]">
                Find your foundation by undertone and depth.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B555E] leading-relaxed">
                True shade comparison works in daylight. Screens change colours, so treat online selectors as a guide. Our Shade Finder suggests three close matches across brands.
              </p>
              <div className="pt-2">
                <Link
                  href="/shade-finder"
                  className="rounded-full bg-[#FAF0F2] border border-[#E8DCE0] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#630D2B] hover:bg-[#630D2B] hover:text-white transition-colors inline-flex items-center gap-2"
                >
                  <Compass size={14} />
                  <span>Launch Shade Finder</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Card 04: Introduce one new active at a time */}
        <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-luxury">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_280px]">
            <div className="space-y-3 order-2 md:order-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A67C39]">
                04 SKIN TOLERANCE HEALTH
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A0A1F]">
                Introduce one new active at a time.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B555E] leading-relaxed">
                Adding several strong products at once makes it hard to tell what suits you. If you have a skin condition or use prescribed products, check with your doctor.
              </p>
              <div className="rounded-xl border border-[#F7DDE3] bg-[#FDF4F6] p-3.5 text-xs text-[#5C0F2E] space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Shield size={13} /> Clinical Safeguard:
                </p>
                <p className="text-[#6B555E] leading-relaxed">
                  Introduce single high-potency actives across 14-day intervals to observe epidermal adaptation without barrier destabilization.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF3F5] order-1 md:order-2">
              <Image
                src="/tips/tip-actives.jpg"
                alt="Active skincare botanical ingredients"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover object-center"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#7E0A29] backdrop-blur shadow-xs">
                SLO-ACTIVE INTRO
              </span>
            </div>
          </div>
        </div>

        {/* Card 05: Sunscreen is a daily step */}
        <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-luxury">
          <div className="grid items-center gap-6 md:grid-cols-[280px_1fr]">
            <div className="relative aspect-[4/3] md:aspect-square w-full overflow-hidden rounded-2xl bg-[#FAF3F5]">
              <Image
                src="/tips/tip-sunscreen.jpg"
                alt="Sunscreen cream texture on stone"
                fill
                sizes="(max-width: 768px) 100vw, 280px"
                className="object-cover object-center"
              />
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#7E0A29] backdrop-blur shadow-xs">
                DAILY UV SHIELD
              </span>
            </div>
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A67C39]">
                05 ESSENTIAL PROTECTION
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#3A0A1F]">
                Sunscreen is a daily step.
              </h3>
              <p className="text-xs sm:text-sm text-[#6B555E] leading-relaxed">
                Apply sunscreen as the last skincare step in the morning and reapply as the product instructions say.
              </p>
              <p className="inline-flex items-center gap-1.5 text-xs text-[#C59B56] font-semibold pt-1">
                <Sun size={14} />
                <span>Broad-spectrum SPF 30+ recommended daily solar armor.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. PERSONALIZED SKINCARE CTA ---------------- */}
      <section className="container">
        <div className="relative overflow-hidden rounded-3xl bg-[#5C0F2E] p-8 text-white shadow-xl md:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-3">
              <span className="inline-block rounded-full border border-[#C59B56]/50 bg-[#3A0615]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#EABE81]">
                PERSONALIZED SKINCARE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                Beauty begins with understanding.
              </h2>
              <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed pt-1">
                Discover how products interact with your skin with Darpana Match. Algorithms tailored to your unique skin concerns, sensitivities, and complexion goals.
              </p>
              <div className="pt-2">
                <Link
                  href="/account/skin-profile"
                  className="rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#5C0F2E] shadow-sm hover:bg-[#FAF3E8] transition-colors inline-flex items-center gap-2"
                >
                  <span>Build my skin profile</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Emblem */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-full border border-white/20 bg-white/10 p-4 text-center backdrop-blur shadow-luxury">
                <div className="space-y-1">
                  <Sparkles size={24} className="mx-auto text-[#EABE81]" />
                  <p className="font-serif text-xs font-bold text-white tracking-widest uppercase">
                    DARPANA
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-white/70">
                    Skin Match Certified
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
