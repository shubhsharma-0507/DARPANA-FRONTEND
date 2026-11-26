'use client';

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Eye,
  FileText,
  Filter,
  FlaskConical,
  HelpCircle,
  Info,
  Lock,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useAuth } from '@/lib/auth';

interface InciItem {
  name: string;
  function: string;
  status: 'bad' | 'warn' | 'ok' | 'neutral';
  badge: string;
  reason: string;
  category: 'allergen' | 'active' | 'base';
}

const PRESET_PRODUCTS = [
  {
    name: 'Pure Botanical Rejuvenating Night Serum',
    brand: 'NILA Atelier Formulations',
    inci: 'Aqua, Rosa Damascena Flower Water, Glycerin, Niacinamide, Squalane, Tocopherol, Retinol, Sodium Hyaluronate, Phenoxyethanol, Ethylhexylglycerin, Parfum, Limonene, Linalool, Citronellol',
  },
  {
    name: 'Barrier Support 5-Ceramide Moisture Cream',
    brand: 'Aurelia Botanical Care',
    inci: 'Aqua, Caprylic/Capric Triglyceride, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Hyaluronic Acid, Xanthan Gum, Phenoxyethanol',
  },
  {
    name: 'Silk Skin Weightless Mineral Foundation',
    brand: 'Darpana Atelier Complexion',
    inci: 'Zinc Oxide, Titanium Dioxide, Aqua, Squalane, Jojoba Seed Oil, Polyglyceryl-4 Isostearate, Silica, Iron Oxides (CI 77491, CI 77492, CI 77499), Tocopherol',
  },
];

const KNOWN_ALLERGEN_CHIPS = [
  { id: 'fragrance', label: 'Fragrance / Parfum' },
  { id: 'retinoids', label: 'Retinoids (Retinol / Retinyl)' },
  { id: 'essential_oils', label: 'Essential Oils / Terpenes' },
  { id: 'nut_oils', label: 'Nut Oils (Almond, Walnut)' },
  { id: 'drying_alcohols', label: 'Drying Alcohols (Alcohol Denat.)' },
  { id: 'sulfates', label: 'Sulfates (SLS / SLES)' },
];

const SKIN_TYPES = ['Sensitive', 'Dry', 'Combination', 'Oily', 'Normal'];

const SKIN_CONDITIONS = [
  'Rosacea',
  'Eczema',
  'Active Acne',
  'Pregnancy / Nursing',
  'Compromised Skin Barrier',
];

export default function AllergenGuardPage() {
  const { me } = useAuth();

  // Inputs
  const [productTitle, setProductTitle] = useState(PRESET_PRODUCTS[0].name);
  const [brandName, setBrandName] = useState(PRESET_PRODUCTS[0].brand);
  const [inciText, setInciText] = useState(PRESET_PRODUCTS[0].inci);

  // Profile preferences
  const [selectedSkinType, setSelectedSkinType] = useState('Sensitive');
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([
    'fragrance',
    'retinoids',
  ]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'Rosacea',
  ]);
  const [customAllergen, setCustomAllergen] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);

  // Screening state
  const [screenTriggered, setScreenTriggered] = useState(true);
  const [tableFilter, setTableFilter] = useState<'all' | 'flagged' | 'beneficial'>('all');

  const toggleAllergen = (id: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCondition = (c: string) => {
    setSelectedConditions((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const addCustomAllergen = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAllergen.trim()) {
      const val = customAllergen.trim().toLowerCase();
      if (!selectedAllergens.includes(val)) {
        setSelectedAllergens((prev) => [...prev, val]);
      }
      setCustomAllergen('');
    }
  };

  const loadPreset = (preset: typeof PRESET_PRODUCTS[0]) => {
    setProductTitle(preset.name);
    setBrandName(preset.brand);
    setInciText(preset.inci);
  };

  // Deterministic Analysis Logic
  const analysis = useMemo(() => {
    const rawItems = inciText
      .split(/[,;\n]/)
      .map((x) => x.trim())
      .filter((x) => x.length > 0);

    const parsed: InciItem[] = rawItems.map((item) => {
      const lower = item.toLowerCase();

      // Check Fragrance / Perfume
      if (lower.includes('parfum') || lower.includes('fragrance') || lower.includes('aroma')) {
        const isFlagged = selectedAllergens.includes('fragrance');
        return {
          name: item,
          function: 'Scent & Odor Masking',
          status: isFlagged ? 'bad' : 'warn',
          badge: isFlagged ? 'Allergen Alert' : 'Synthetic Scent',
          reason: isFlagged
            ? 'Matches your avoidance trigger for fragrance. Primary cause of cosmetic contact dermatitis.'
            : 'Fragrance compound; may cause sensitivity in reactive barriers.',
          category: 'allergen',
        };
      }

      // Check Terpenes / Essential oil derivatives (Limonene, Linalool, Citronellol)
      if (
        lower.includes('limonene') ||
        lower.includes('linalool') ||
        lower.includes('citronellol') ||
        lower.includes('geraniol')
      ) {
        const isFlagged =
          selectedAllergens.includes('fragrance') ||
          selectedAllergens.includes('essential_oils');
        return {
          name: item,
          function: 'Botanical Fragrance Component',
          status: isFlagged ? 'bad' : 'warn',
          badge: isFlagged ? 'Sensitizer Flag' : 'Potential Irritant',
          reason: 'Naturally occurring oxidizable allergen commonly found in botanical scents.',
          category: 'allergen',
        };
      }

      // Check Retinoids
      if (lower.includes('retinol') || lower.includes('retinyl') || lower.includes('tretinoin')) {
        const isFlagged =
          selectedAllergens.includes('retinoids') ||
          selectedConditions.includes('Pregnancy / Nursing') ||
          selectedConditions.includes('Rosacea');
        return {
          name: item,
          function: 'Epidermal Turnover Active',
          status: isFlagged ? 'bad' : 'warn',
          badge: isFlagged ? 'Avoid Trigger' : 'Potent Active',
          reason: isFlagged
            ? 'Contraindicated for rosacea, pregnancy, or specified retinoid avoidance.'
            : 'Requires step-up introduction to avoid epidermal peeling and irritation.',
          category: 'allergen',
        };
      }

      // Check Drying Alcohols
      if (
        lower.includes('alcohol denat') ||
        lower.includes('denatured alcohol') ||
        lower.includes('isopropyl alcohol')
      ) {
        const isFlagged =
          selectedAllergens.includes('drying_alcohols') ||
          selectedSkinType === 'Sensitive' ||
          selectedSkinType === 'Dry';
        return {
          name: item,
          function: 'Fast-Drying Solvent',
          status: isFlagged ? 'bad' : 'warn',
          badge: isFlagged ? 'Barrier Risk' : 'Solvent',
          reason: 'Can strip epidermal intercellular lipids, exacerbating dry or sensitive skin.',
          category: 'allergen',
        };
      }

      // Beneficial actives
      if (lower.includes('niacinamide')) {
        return {
          name: item,
          function: 'Vitamin B3 Barrier Conditioner',
          status: 'ok',
          badge: 'Beneficial Active',
          reason: 'Stimulates ceramide synthesis and reduces erythema/redness in sensitive skin.',
          category: 'active',
        };
      }
      if (lower.includes('squalane')) {
        return {
          name: item,
          function: 'Biomimetic Lipid Restorative',
          status: 'ok',
          badge: 'Skin Nourishing',
          reason: 'Identical to human skin lipids; reinforces stratum corneum without pore clogging.',
          category: 'active',
        };
      }
      if (lower.includes('ceramide') || lower.includes('phytosphingosine')) {
        return {
          name: item,
          function: 'Intercellular Lipid Barrier Matrix',
          status: 'ok',
          badge: 'Barrier Repair',
          reason: 'Directly restores broken moisture barriers and seals hydration.',
          category: 'active',
        };
      }
      if (lower.includes('hyaluron') || lower.includes('glycerin')) {
        return {
          name: item,
          function: 'Critical Humectant',
          status: 'ok',
          badge: 'Deep Hydration',
          reason: 'Draws moisture from atmosphere into dermal reservoirs with zero irritancy.',
          category: 'base',
        };
      }
      if (lower.includes('zinc oxide') || lower.includes('titanium dioxide')) {
        return {
          name: item,
          function: 'Physical Mineral Shield',
          status: 'ok',
          badge: 'Hypoallergenic UV',
          reason: 'Physically sits on top of skin without penetrating; ideal for rosacea.',
          category: 'active',
        };
      }

      // Neutral default
      return {
        name: item,
        function: 'Formulation Vehicle / Emollient',
        status: 'neutral',
        badge: 'Low Hazard',
        reason: 'Common, neutral cosmetic carrier verified in standard pharmacopeia.',
        category: 'base',
      };
    });

    const flaggedCount = parsed.filter((x) => x.status === 'bad').length;
    const warningCount = parsed.filter((x) => x.status === 'warn').length;
    const beneficialCount = parsed.filter((x) => x.status === 'ok').length;

    // Compatibility Index
    let score = 100 - flaggedCount * 22 - warningCount * 8;
    score = Math.max(15, Math.min(98, score));

    const overallLevel =
      flaggedCount > 0
        ? 'caution'
        : warningCount > 1
        ? 'moderate'
        : 'safe';

    return {
      items: parsed,
      flaggedCount,
      warningCount,
      beneficialCount,
      score,
      overallLevel,
    };
  }, [inciText, selectedAllergens, selectedConditions, selectedSkinType]);

  const filteredItems = useMemo(() => {
    if (tableFilter === 'flagged') {
      return analysis.items.filter((x) => x.status === 'bad' || x.status === 'warn');
    }
    if (tableFilter === 'beneficial') {
      return analysis.items.filter((x) => x.status === 'ok');
    }
    return analysis.items;
  }, [analysis.items, tableFilter]);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* ---------------- 1. HERO SECTION ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F6] via-[#FFF8F9] to-[#FAF4F6] pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-[#F0E5E8]">
        <div className="container relative">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Left Copy */}
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
                <Shield size={14} className="text-[#C59B56]" />
                <span>DARPANA DIAGNOSTIC TOOLS</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3A0A1F] leading-[1.1]">
                Know Before You{' '}
                <span className="font-serif italic text-[#8C2449]">Glow.</span>
              </h1>

              <p className="max-w-xl text-xs sm:text-sm md:text-base text-[#6B555E] leading-relaxed">
                Our dual-matrix formulation scanner compares the exact ingredients in any product against your personal INCI sensitivity profile, flags potential allergens, and evaluates your overall coverage confidence.
              </p>

              {/* Trust Points */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs font-semibold text-[#8C747E] pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 border border-[#E8DCE0] shadow-xs">
                  <CheckCircle2 size={13} className="text-[#26734E]" />
                  Deterministic Rule-Based
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 border border-[#E8DCE0] shadow-xs">
                  <Lock size={13} className="text-[#8C2449]" />
                  Zero Data Reselling
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 sm:px-3.5 sm:py-1.5 border border-[#E8DCE0] shadow-xs">
                  <FlaskConical size={13} className="text-[#C59B56]" />
                  100% INCI Match Index
                </span>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="relative h-[260px] sm:h-[340px] md:h-[380px] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-luxury bg-[#FAF0F2] border border-white">
                <Image
                  src="/allergen/allergen-hero.jpg"
                  alt="Glass dropper bottles on soft rose textile"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex flex-wrap items-center justify-between gap-1.5">
                  <span className="rounded-full bg-black/60 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur border border-white/20">
                    Personalized Dual-Matrix Screening
                  </span>
                  <span className="rounded-full bg-[#EAF5EF] px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#26734E]">
                    LIVE AUDIT READY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. SCREENING WORKBENCH ---------------- */}
      <section className="container max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
            SCREENING WORKBENCH
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3A0A1F]">
            Declare Your Dual Matrix:
          </h2>
          <p className="text-xs md:text-sm text-[#7A646E] max-w-xl mx-auto leading-relaxed">
            Fill in your product and skin sensitivity profile below to run our deterministic dual-matrix engine across the full INCI database.
          </p>
        </div>

        {/* Dual Matrix Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Matrix 1: Product Formulation */}
          <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#F7EFF1] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF0F2] text-xs font-bold text-[#630D2B]">
                  01
                </span>
                <h3 className="font-serif text-lg font-bold text-[#3A0A1F]">
                  Tell us about the product
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                INCI Formulation
              </span>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8A737B]">
                Quick Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESET_PRODUCTS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => loadPreset(p)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      productTitle === p.name
                        ? 'bg-[#630D2B] text-white'
                        : 'bg-[#FAF0F2] text-[#630D2B] hover:bg-[#F5E6EA]'
                    }`}
                  >
                    {p.name.split(' ')[0]} {p.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Title & Brand */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink/80">Product Title</label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  className="input text-xs"
                  placeholder="e.g. Pure Botanical Rejuvenating Serum"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-ink/80">Atelier / Brand</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="input text-xs"
                  placeholder="e.g. NILA Atelier Formulations"
                />
              </div>
            </div>

            {/* INCI Text Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-ink/80">
                  Full INCI Ingredient List (Comma-separated)
                </label>
                <span className="text-[10px] text-muted">Paste any label</span>
              </div>
              <textarea
                rows={5}
                value={inciText}
                onChange={(e) => setInciText(e.target.value)}
                className="w-full rounded-2xl border border-line bg-[#FAF3F5]/60 p-3.5 text-xs text-ink/90 placeholder:text-muted/60 focus:border-[#5C0F2E] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5C0F2E]/30 leading-relaxed font-mono"
                placeholder="Aqua, Glycerin, Niacinamide, Retinol, Parfum..."
              />
            </div>
          </div>

          {/* Matrix 2: User Skin Sensitivity */}
          <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-[#F7EFF1] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF0F2] text-xs font-bold text-[#630D2B]">
                  02
                </span>
                <h3 className="font-serif text-lg font-bold text-[#3A0A1F]">
                  Let&apos;s understand your skin
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Biological Profile
              </span>
            </div>

            {/* Skin Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/80">1. Primary Skin Type</label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedSkinType(t)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      selectedSkinType === t
                        ? 'bg-[#630D2B] text-white shadow-xs'
                        : 'bg-[#FAF0F2] text-ink/80 hover:bg-[#F2E4E8]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Known Allergies */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/80">
                2. Allergens &amp; Compounds to Avoid
              </label>
              <div className="flex flex-wrap gap-2">
                {KNOWN_ALLERGEN_CHIPS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAllergen(a.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedAllergens.includes(a.id)
                        ? 'bg-[#630D2B] text-white shadow-xs'
                        : 'bg-[#FAF0F2] text-ink/80 hover:bg-[#F2E4E8]'
                    }`}
                  >
                    {selectedAllergens.includes(a.id) && <Check size={11} />}
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Custom allergen input */}
              <form onSubmit={addCustomAllergen} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={customAllergen}
                  onChange={(e) => setCustomAllergen(e.target.value)}
                  placeholder="Add custom trigger (e.g. Phenoxyethanol, Lanolin)"
                  className="input h-9 text-xs flex-1"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#FAF0F2] border border-[#E8DCE0] px-4 text-xs font-bold uppercase text-[#630D2B] hover:bg-[#630D2B] hover:text-white transition-colors"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Conditions */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-ink/80">
                3. Current Conditions &amp; Sensitivities
              </label>
              <div className="flex flex-wrap gap-2">
                {SKIN_CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCondition(c)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all flex items-center gap-1.5 ${
                      selectedConditions.includes(c)
                        ? 'bg-[#8C2449] text-white shadow-xs'
                        : 'bg-[#FAF0F2] text-ink/80 hover:bg-[#F2E4E8]'
                    }`}
                  >
                    {selectedConditions.includes(c) && <Check size={11} />}
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#630D2B]"
                />
                <span>
                  I consent to deterministic local screening. Zero data is shared with sellers or advertising networks.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Screen My Product Action Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#4A0A1D] via-[#630E29] to-[#45091A] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#EABE81]">
              DETERMINISTIC INCI ENGINE
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Ready to discover what&apos;s inside?
            </h3>
            <p className="text-xs text-white/80 max-w-lg">
              Screening against {analysis.items.length} ingredients and your unique avoidance triggers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setScreenTriggered(true)}
            className="rounded-full bg-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-[#5C0F2E] shadow-md hover:bg-[#FAF3E8] transition-all transform hover:scale-[1.02] shrink-0 inline-flex items-center gap-2"
          >
            <span>SCREEN MY PRODUCT</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ---------------- 3. SCREENING REPORT ---------------- */}
      {screenTriggered && (
        <section className="container max-w-6xl space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="rounded-3xl border border-[#EFE5E8] bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F7EFF1] pb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  YOUR PERSONAL SCREENING REPORT
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3A0A1F] mt-1">
                  {productTitle}
                </h2>
                <p className="text-xs text-[#8C747E] font-medium mt-0.5">
                  Formulated by {brandName} · {analysis.items.length} INCI ingredients audited
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-2xl px-5 py-3 text-center border ${
                    analysis.overallLevel === 'caution'
                      ? 'bg-[#FDF4F6] border-[#F7DDE3] text-[#7E0A29]'
                      : 'bg-[#EAF5EF] border-[#CDE5D6] text-[#26734E]'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                    Compatibility Index
                  </p>
                  <p className="font-serif text-3xl font-bold">{analysis.score}%</p>
                </div>
              </div>
            </div>

            {/* Status Alert Banner */}
            {analysis.flaggedCount > 0 ? (
              <div className="rounded-2xl border border-[#FAD0D6] bg-[#FCECF0] p-4 text-xs text-[#7E0A29] flex items-start gap-3">
                <AlertTriangle size={18} className="shrink-0 text-[#B42318] mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-sm">
                    Caution: {analysis.flaggedCount} Avoidance Triggers Detected
                  </strong>
                  <p className="leading-relaxed text-[#7E0A29]/90">
                    This formulation contains ingredients that directly match your allergen avoidance list. We recommend reviewing the detailed INCI breakdown below or selecting an atelier alternative.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#CDE5D6] bg-[#EAF5EF] p-4 text-xs text-[#26734E] flex items-start gap-3">
                <CheckCircle2 size={18} className="shrink-0 text-[#26734E] mt-0.5" />
                <div className="space-y-1">
                  <strong className="font-bold text-sm">
                    Allergen-Safe: 0 Flagged Triggers
                  </strong>
                  <p className="leading-relaxed text-[#26734E]/90">
                    No declared allergens or active contraindications were found in this formulation for your skin profile.
                  </p>
                </div>
              </div>
            )}

            {/* 3 Overview Metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-line bg-[#FAF5F6] p-4 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Allergens Detected
                </p>
                <p className="font-serif text-xl font-bold text-[#3A0A1F]">
                  {analysis.flaggedCount} Flagged{' '}
                  <span className="text-xs font-normal text-muted">
                    ({analysis.warningCount} to watch)
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-[#FAF5F6] p-4 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Barrier Impact
                </p>
                <p className="font-serif text-xl font-bold text-[#3A0A1F]">
                  {analysis.beneficialCount > 0 ? 'Restorative Actives' : 'Neutral Base'}
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-[#FAF5F6] p-4 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  Confidence Level
                </p>
                <p className="font-serif text-xl font-bold text-[#26734E]">
                  94% Verified Match
                </p>
              </div>
            </div>

            {/* INCI Breakdown Table */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-serif text-lg font-bold text-[#3A0A1F]">
                  Full INCI Ingredient Breakdown
                </h3>
                {/* Filter Tabs */}
                <div className="flex gap-1.5 rounded-full bg-[#FAF0F2] p-1 self-start sm:self-auto text-xs">
                  <button
                    type="button"
                    onClick={() => setTableFilter('all')}
                    className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                      tableFilter === 'all'
                        ? 'bg-white text-[#630D2B] shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    All ({analysis.items.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableFilter('flagged')}
                    className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                      tableFilter === 'flagged'
                        ? 'bg-white text-[#630D2B] shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    Flags &amp; Irritants ({analysis.flaggedCount + analysis.warningCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableFilter('beneficial')}
                    className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                      tableFilter === 'beneficial'
                        ? 'bg-white text-[#630D2B] shadow-xs'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    Beneficial ({analysis.beneficialCount})
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[#EFE5E8]">
                <table className="w-full text-left text-xs min-w-[620px]">
                  <thead className="border-b border-[#EFE5E8] bg-[#FAF5F6] text-[10px] font-bold uppercase tracking-wider text-[#8A737B]">
                    <tr>
                      <th className="py-3 px-4">Ingredient (INCI)</th>
                      <th className="py-3 px-4">Bio-Function</th>
                      <th className="py-3 px-4">Status &amp; Safety</th>
                      <th className="py-3 px-4">Clinical Insight &amp; Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7EFF1]">
                    {filteredItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-[#FAF8F9] transition-colors ${
                          item.status === 'bad' ? 'bg-[#FFF8F9]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-ink font-mono text-[11px]">
                          {item.name}
                        </td>
                        <td className="py-3.5 px-4 text-[#6B555E]">{item.function}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'bad'
                                ? 'bg-[#FCECF0] text-[#B42318] border border-[#FAD0D6]'
                                : item.status === 'warn'
                                ? 'bg-[#FAF3E8] text-[#8C6D58] border border-[#F2E5D5]'
                                : item.status === 'ok'
                                ? 'bg-[#EAF5EF] text-[#26734E] border border-[#D5EADB]'
                                : 'bg-[#FAF0F2] text-ink/80 border border-[#EFE3E6]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#7A646E] max-w-sm leading-relaxed">
                          {item.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="border-t border-[#F7EFF1] pt-4 text-[11px] text-[#8C7680] italic leading-relaxed">
              <strong>Important Diagnostic Boundary:</strong> Allergen Guard matches declared INCI labels with verified chemical dictionaries and your shared avoidance triggers. It is not clinical medical advice. Always perform a 24-hour patch test prior to full facial application.
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 4. ALLERGEN-FREE ATELIER MATCHES ---------------- */}
      <section className="container max-w-6xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
              RECOMMENDED FOR YOUR PROFILE
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold text-[#3A0A1F]">
              Allergen-Free Atelier Matches
            </h2>
          </div>
          <Link
            href="/products?sort=popular"
            className="text-xs font-bold uppercase tracking-wider text-[#630D2B] hover:underline inline-flex items-center gap-1"
          >
            VIEW ALL SAFE FORMULATIONS <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3 Matches */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Product 1 */}
          <div className="rounded-2xl border border-[#EFE5E8] bg-white overflow-hidden shadow-sm hover:shadow-luxury transition-all flex flex-col group">
            <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3F5]">
              <Image
                src="/allergen/alt-saffron.jpg"
                alt="Pure Saffron & Lotus Radiance Nectar"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded bg-[#EAF5EF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#26734E]">
                100% FRAGRANCE-FREE
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A737B]">
                AURELIA ATELIER
              </span>
              <h3 className="font-serif text-base font-bold text-[#24141E] group-hover:text-[#630D2B] transition-colors">
                Pure Saffron &amp; Lotus Radiance Nectar
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Cold-infused Kashmiri saffron and blue lotus extract. Free of all fragrance and essential oils.
              </p>
              <div className="mt-auto pt-3 border-t border-[#F7EFF1] flex items-center justify-between">
                <span className="font-bold text-[#5C0F2E]">₹1,499</span>
                <Link
                  href="/products?category=skincare"
                  className="rounded-full bg-[#FAF0F2] px-3.5 py-1.5 text-xs font-semibold text-[#630D2B] hover:bg-[#630D2B] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Product 2 */}
          <div className="rounded-2xl border border-[#EFE5E8] bg-white overflow-hidden shadow-sm hover:shadow-luxury transition-all flex flex-col group">
            <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3F5]">
              <Image
                src="/allergen/alt-centella.jpg"
                alt="Centella Calming Ceramide Elixir"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded bg-[#EAF5EF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#26734E]">
                BARRIER-REPAIRING · ZERO RETINOL
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A737B]">
                NILA ATELIER
              </span>
              <h3 className="font-serif text-base font-bold text-[#24141E] group-hover:text-[#630D2B] transition-colors">
                Centella Calming Ceramide Elixir
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Bio-fermented centella asiatica and triple ceramides to repair rosacea and compromised barriers.
              </p>
              <div className="mt-auto pt-3 border-t border-[#F7EFF1] flex items-center justify-between">
                <span className="font-bold text-[#5C0F2E]">₹1,299</span>
                <Link
                  href="/products?category=skincare"
                  className="rounded-full bg-[#FAF0F2] px-3.5 py-1.5 text-xs font-semibold text-[#630D2B] hover:bg-[#630D2B] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Product 3 */}
          <div className="rounded-2xl border border-[#EFE5E8] bg-white overflow-hidden shadow-sm hover:shadow-luxury transition-all flex flex-col group">
            <div className="relative aspect-square w-full overflow-hidden bg-[#FAF3F5]">
              <Image
                src="/allergen/alt-rosehip.jpg"
                alt="Cold-Pressed Organic Rosehip Seed Oil"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded bg-[#EAF5EF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#26734E]">
                100% SINGLE-INGREDIENT
              </span>
            </div>
            <div className="flex flex-1 flex-col p-4 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A737B]">
                BOTANICAL LABS
              </span>
              <h3 className="font-serif text-base font-bold text-[#24141E] group-hover:text-[#630D2B] transition-colors">
                Cold-Pressed Rosehip Seed Oil
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Virgin unrefined seed oil rich in omega-3 and provitamin A with zero synthetic preservatives.
              </p>
              <div className="mt-auto pt-3 border-t border-[#F7EFF1] flex items-center justify-between">
                <span className="font-bold text-[#5C0F2E]">₹899</span>
                <Link
                  href="/products?category=skincare"
                  className="rounded-full bg-[#FAF0F2] px-3.5 py-1.5 text-xs font-semibold text-[#630D2B] hover:bg-[#630D2B] hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 5. METHODOLOGY ---------------- */}
      <section className="container max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C59B56]">
            HOW IT WORKS
          </p>
          <h2 className="font-serif text-3xl font-bold text-[#3A0A1F]">
            Beauty choices, with greater awareness.
          </h2>
          <p className="text-xs md:text-sm text-[#7A646E] max-w-xl mx-auto leading-relaxed">
            Deterministic matching compares each chemical ingredient to standard dermatological guidelines.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Paste your product',
              desc: 'Enter any cosmetic product title and paste the full INCI ingredient list directly from the packaging.',
            },
            {
              step: '02',
              title: 'Share your skin profile',
              desc: 'Select your skin type, known contact allergies, and barrier conditions with zero data reselling.',
            },
            {
              step: '03',
              title: 'Review your results',
              desc: 'Receive transparent safety match scores, allergen flags, and plain-language scientific explanations.',
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="rounded-3xl border border-[#EFE5E8] bg-white p-6 shadow-sm space-y-2.5"
            >
              <span className="font-serif text-3xl font-light text-[#D1486E]/40">
                {step}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3A0A1F]">{title}</h3>
              <p className="text-xs text-[#6B555E] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
