'use client';
import { ChevronDown, FlaskConical, Heart, Leaf, Menu, RotateCcw, Search, Shield, ShieldCheck, ShoppingBag, Sparkles, Truck, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { homeFor, useAuth } from '@/lib/auth';
import { api, money } from '@/lib/api';
import { useSiteConfig } from '@/lib/site';

const FALLBACK_CATS = [
  ['Skincare', 'skincare'],
  ['Makeup', 'makeup'],
  ['Fragrances', 'fragrance'],
  ['Hair Care', 'hair-care'],
  ['Nail Care', 'nail-care'],
  ['Beauty Sets', 'beauty-sets'],
];

function TopBar() {
  const cfg = useSiteConfig();
  return (
    <div className="bg-[#560B23] text-white/95 text-[11px] md:text-xs py-1.5 border-b border-[#6E1231]">
      <div className="container flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-white/90">
          <Shield size={13} className="text-[#EABE81]" />
          <span className="font-semibold tracking-wider uppercase text-[10px] md:text-[11px]">DARPANA ATELIER STANDARD</span>
        </div>
        <p className="hidden lg:block text-center text-white/85 text-[11px] tracking-wide">
          {cfg ? `FREE SHIPPING ON ORDERS ABOVE ${money(cfg.freeShippingAbove)}` : 'FREE SHIPPING ON SELECT ORDERS'} · ORIGINAL PRODUCTS FROM VERIFIED SELLERS · SKIN MATCH: SHOP FOR YOUR SKIN PROFILE · EASY RETURNS
        </p>
        <div className="flex items-center gap-3 text-[11px] ml-auto">
          <Link href="/register?type=seller" className="text-white/90 hover:text-white uppercase tracking-wider font-medium hover:underline">
            SELL ON DARPANA
          </Link>
          <span className="text-white/40">|</span>
          <span className="text-white/80 font-medium">EN / INR</span>
        </div>
      </div>
    </div>
  );
}

function Dropdown({ label, items, active }: { label: string; items: [string, string][]; active?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const out = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', out);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', out);
      document.removeEventListener('keydown', esc);
    };
  }, []);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${active ? 'text-[#630D2B]' : 'text-ink/80 hover:text-[#630D2B]'}`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown size={13} aria-hidden className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-1.5">
          <ul className="min-w-[210px] rounded-xl border border-line bg-white/98 p-1.5 shadow-luxury backdrop-blur">
            {items.map(([name, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-xs font-medium text-ink/90 hover:bg-[#FAF0F2] hover:text-[#630D2B] transition-colors"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { me, cartCount, wishlistCount, logout, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [sugg, setSugg] = useState<{ products: any[]; brands: any[] }>({ products: [], brands: [] });
  const [cats, setCats] = useState<[string, string][]>(FALLBACK_CATS as unknown as [string, string][]);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api('/categories').then((r) => r.items?.length && setCats(r.items.map((c: any) => [c.name, c.slug]))).catch(() => {});
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (q.trim().length < 2) { setSugg({ products: [], brands: [] }); return; }
    const t = setTimeout(() => api('/search/suggest', { query: { q } }).then(setSugg).catch(() => {}), 220);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const f = (e: MouseEvent) => { if (!userRef.current?.contains(e.target as Node)) setUserOpen(false); };
    document.addEventListener('mousedown', f);
    return () => document.removeEventListener('mousedown', f);
  }, []);

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setSugg({ products: [], brands: [] });
    setOpen(false);
  };

  const isBuyer = !me || me.role === 'BUYER';
  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${path === href ? 'text-[#630D2B]' : 'text-ink/80 hover:text-[#630D2B]'}`}
    >
      {label}
    </Link>
  );

  const badge = (n: number) =>
    n > 0 && (
      <span className="tnum absolute -right-1 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#630D2B] px-1 text-[10px] font-bold text-white shadow-sm">
        {n}
      </span>
    );

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-30 border-b border-[#F0E5E8] bg-white/95 backdrop-blur-md">
        <div className="container py-3">
          {/* Main row: Logo, Search, User actions */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/" aria-label="Darpana Cosmetics home" className="shrink-0 flex flex-col group">
              <span className="font-serif text-2xl md:text-3xl font-extrabold tracking-[0.22em] text-[#5C0F2E] leading-none group-hover:text-[#630D2B] transition-colors">
                DARPANA
              </span>
              <span className="font-serif text-[11px] md:text-xs tracking-[0.14em] text-[#8C2449] font-normal leading-tight mt-0.5">
                Cosmetics
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl mx-auto hidden md:block">
              <form className="relative" role="search" onSubmit={go}>
                <input
                  className="h-10 w-full rounded-full border border-[#E8DCE0] bg-[#FAF3F5]/80 pl-10 pr-4 text-xs placeholder:text-muted/70 focus:border-[#5C0F2E] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#5C0F2E]/30 transition-all"
                  placeholder="Search formulations, shade notes, botanicals..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label="Search formulations, shade notes, botanicals"
                />
                <Search size={16} className="absolute left-3.5 top-3 text-[#7A646E]" />
                {(sugg.products.length > 0 || sugg.brands.length > 0) && (
                  <div className="card absolute inset-x-0 top-11 z-40 p-2 shadow-luxury border-line">
                    {sugg.brands.map((b) => (
                      <Link
                        key={b.slug}
                        href={`/products?brand=${b.slug}`}
                        onClick={() => setSugg({ products: [], brands: [] })}
                        className="block rounded-lg px-3 py-2 text-xs hover:bg-[#FAF0F2]"
                      >
                        {b.name} <span className="text-[10px] text-muted uppercase font-semibold">brand</span>
                      </Link>
                    ))}
                    {sugg.products.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/products/${p.slug}`}
                        onClick={() => setSugg({ products: [], brands: [] })}
                        className="block rounded-lg px-3 py-2 text-xs hover:bg-[#FAF0F2] font-medium"
                      >
                        {p.title}
                      </Link>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              {isBuyer && (
                <Link
                  href={me ? '/account/wishlist' : '/login'}
                  className="iconbtn relative"
                  aria-label={`Wishlist, ${wishlistCount} items`}
                >
                  <Heart size={20} className="text-[#3A0A1F]" />
                  {badge(wishlistCount)}
                </Link>
              )}

              {isBuyer && (
                <Link
                  href="/cart"
                  className="iconbtn relative"
                  aria-label={`Cart, ${cartCount} items`}
                >
                  <ShoppingBag size={20} className="text-[#3A0A1F]" />
                  {badge(cartCount)}
                </Link>
              )}

              <div ref={userRef} className="relative">
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5C0F2E] text-white hover:bg-[#45091F] transition-colors"
                  aria-label="Account"
                  aria-expanded={userOpen}
                  onClick={() => (me || loading ? setUserOpen(!userOpen) : router.push('/login'))}
                >
                  <User size={18} />
                </button>
                {userOpen && me && (
                  <div className="card absolute right-0 top-11 z-50 w-56 p-2 shadow-luxury border-line">
                    <p className="truncate px-3 py-1.5 text-xs font-semibold text-ink">{me.name}</p>
                    <p className="truncate px-3 pb-2 text-[11px] text-muted">
                      {me.role === 'SHOP_OWNER' ? 'Seller' : me.role === 'ADMIN' ? 'Admin' : 'Shopper'} · {me.email}
                    </p>
                    <div className="h-px bg-line my-1" />
                    <Link
                      href={homeFor(me.role)}
                      onClick={() => setUserOpen(false)}
                      className="block rounded-lg px-3 py-2 text-xs font-medium hover:bg-[#FAF0F2] text-ink"
                    >
                      {me.role === 'BUYER' ? 'My Account & Sanctuary' : me.role === 'ADMIN' ? 'Admin Dashboard' : 'Seller Portal'}
                    </Link>
                    {me.role === 'BUYER' && (
                      <>
                        <Link
                          href="/account/skin-profile"
                          onClick={() => setUserOpen(false)}
                          className="block rounded-lg px-3 py-2 text-xs font-medium hover:bg-[#FAF0F2] text-ink"
                        >
                          Skin Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserOpen(false)}
                          className="block rounded-lg px-3 py-2 text-xs font-medium hover:bg-[#FAF0F2] text-ink"
                        >
                          Orders
                        </Link>
                      </>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-bad hover:bg-[#FAF0F2]"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {!loading && !me && (
                <Link href="/login" className="btn-primary btn-sm hidden whitespace-nowrap md:inline-flex">
                  Sign in
                </Link>
              )}

              <button
                className="iconbtn lg:hidden"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
                aria-label="Menu"
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Desktop Nav menu */}
          <nav aria-label="Main" className="hidden lg:flex items-center gap-1 pt-3 mt-2 border-t border-[#F5EAEB]">
            <Link
              href="/products"
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                path === '/products' && !path.includes('?') ? 'bg-[#630D2B] text-white shadow-sm' : 'bg-[#630D2B] text-white hover:bg-[#4C081F]'
              }`}
            >
              SHOP ALL
            </Link>

            <Dropdown
              label="CATEGORIES"
              active={path.startsWith('/products?category')}
              items={cats.map(([n, s]) => [n, `/products?category=${s}`] as [string, string])}
            />

            {navLink('/account/skin-profile', 'SKIN MATCH')}
            {navLink('/shade-finder', 'SHADE FINDER')}
            {navLink('/offers', 'OFFERS')}
            {navLink('/about', 'ABOUT')}
            {navLink('/beauty-tips', 'BEAUTY TIPS')}
          </nav>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="container space-y-3 border-t border-line py-4 lg:hidden bg-white">
            <form onSubmit={go} className="relative">
              <input
                className="input rounded-full pr-12 text-xs"
                placeholder="Search formulations, shade notes..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search products"
              />
              <button aria-label="Search" className="absolute right-2 top-2 h-8 w-8 text-[#5C0F2E]">
                <Search size={18} className="mx-auto" />
              </button>
            </form>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link href="/products" className="btn-primary btn-sm text-center">
                Shop All
              </Link>
              <Link href="/shade-finder" className="btn-ghost btn-sm text-center">
                Shade Finder
              </Link>
              <Link href="/account/skin-profile" className="btn-ghost btn-sm text-center">
                Skin Match
              </Link>
              <Link href="/offers" className="btn-ghost btn-sm text-center">
                Offers
              </Link>
              <Link href="/about" className="btn-ghost btn-sm text-center">
                About Us
              </Link>
              <Link href="/beauty-tips" className="btn-ghost btn-sm text-center">
                Beauty Tips
              </Link>
              <Link href="/contact" className="btn-ghost btn-sm text-center">
                Contact
              </Link>
              <Link href="/register?type=seller" className="btn-ghost btn-sm text-center">
                Sell on Darpana
              </Link>
            </div>
            <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-muted">Categories</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {cats.map(([n, s]) => (
                <Link key={s} href={`/products?category=${s}`} className="btn-ghost btn-sm text-center">
                  {n}
                </Link>
              ))}
            </div>
            {!me && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" className="btn-primary btn-sm text-center">
                  Sign in
                </Link>
                <Link href="/register" className="btn-ghost btn-sm text-center">
                  Create account
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubbed(true);
      setEmail('');
    }
  };

  return (
    <footer className="mt-24 border-t border-[#EFE3E6] bg-[#FAF4F6] text-ink">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Newsletter */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-flex flex-col">
              <span className="font-serif text-2xl font-extrabold tracking-[0.22em] text-[#5C0F2E] leading-none">
                DARPANA
              </span>
              <span className="font-serif text-xs tracking-[0.14em] text-[#8C2449] font-normal leading-tight mt-0.5">
                Cosmetics
              </span>
            </Link>
            <p className="text-xs text-[#7A646E] leading-relaxed">
              A curated digital sanctuary bridging dermatological rigor, ingredient authenticity, and high-fashion cosmetic discernment.
            </p>
            <div className="pt-2">
              <p className="text-[11px] font-bold tracking-widest uppercase text-[#5C0F2E] mb-2">
                EDITORIAL NEWSLETTER
              </p>
              {subbed ? (
                <p className="text-xs text-ok font-medium">Thank you for subscribing to our editorial letters.</p>
              ) : (
                <form onSubmit={handleSub} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your correspondence email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 rounded-full border border-[#E0D2D6] bg-white px-3.5 text-xs placeholder:text-muted/70 focus:border-[#5C0F2E] focus:outline-none flex-1"
                  />
                  <button type="submit" className="h-9 rounded-full bg-[#630D2B] px-4 text-xs font-medium text-white hover:bg-[#4B081F] transition-colors shrink-0">
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Curated Shop */}
          <div>
            <h3 className="mb-3 font-serif text-sm font-bold text-[#3A0A1F] tracking-wide">Curated Shop</h3>
            <ul className="space-y-2 text-xs text-[#7A646E]">
              <li><Link href="/products?category=skincare" className="hover:text-[#630D2B] transition-colors">Skincare Formulations</Link></li>
              <li><Link href="/products?category=makeup" className="hover:text-[#630D2B] transition-colors">Atelier Makeup</Link></li>
              <li><Link href="/products?category=fragrance" className="hover:text-[#630D2B] transition-colors">Rare Fragrances</Link></li>
              <li><Link href="/products?category=hair-care" className="hover:text-[#630D2B] transition-colors">Hair & Scalp Care</Link></li>
              <li><Link href="/products?category=nail-care" className="hover:text-[#630D2B] transition-colors">Nail Lacquers</Link></li>
              <li><Link href="/products?category=beauty-sets" className="hover:text-[#630D2B] transition-colors">Curated Sets</Link></li>
            </ul>
          </div>

          {/* Col 3: Diagnostic Tools */}
          <div>
            <h3 className="mb-3 font-serif text-sm font-bold text-[#3A0A1F] tracking-wide">Diagnostic Tools</h3>
            <ul className="space-y-2 text-xs text-[#7A646E]">
              <li><Link href="/account/skin-profile" className="hover:text-[#630D2B] transition-colors">Skin Profile Diagnostic</Link></li>
              <li><Link href="/shade-finder" className="hover:text-[#630D2B] transition-colors">Digital Shade Mirror</Link></li>
              <li><Link href="/about" className="hover:text-[#630D2B] transition-colors">Ingredient Integrity Index</Link></li>
              <li><Link href="/offers" className="hover:text-[#630D2B] transition-colors">Atelier Privileges</Link></li>
            </ul>
          </div>

          {/* Col 4: Atelier & Care */}
          <div>
            <h3 className="mb-3 font-serif text-sm font-bold text-[#3A0A1F] tracking-wide">Atelier & Care</h3>
            <ul className="space-y-2 text-xs text-[#7A646E]">
              <li><Link href="/about" className="hover:text-[#630D2B] transition-colors">The Atelier Story</Link></li>
              <li><Link href="/register?type=seller" className="hover:text-[#630D2B] transition-colors">Verified Seller Portal</Link></li>
              <li><Link href="/contact" className="hover:text-[#630D2B] transition-colors">Concierge & Returns</Link></li>
              <li><Link href="/about" className="hover:text-[#630D2B] transition-colors">Authenticity Guarantee</Link></li>
            </ul>
          </div>

          {/* Col 5: Sanctuary Values */}
          <div>
            <h3 className="mb-3 font-serif text-sm font-bold text-[#3A0A1F] tracking-wide">Sanctuary Values</h3>
            <p className="text-xs text-[#7A646E] leading-relaxed mb-4">
              Every formulation verified for chemical stability, provenance authenticity, and cruelty-free formulation standards.
            </p>
            <div className="flex items-center gap-3 text-[#5C0F2E]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DCE0]" title="Cruelty-Free / Ethical">
                <Leaf size={16} />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DCE0]" title="Authenticity Verified">
                <ShieldCheck size={16} />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-[#E8DCE0]" title="Formulation Science">
                <FlaskConical size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-6 border-t border-[#EDE1E4] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#8C7680]">
          <p>
            Skin Match compares what you share with a product's listed ingredients. It is not medical advice. © 2026 Darpana Cosmetics. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">Privacy Policy</Link>
            <span>·</span>
            <Link href="/about" className="hover:underline">Terms of Sanctuary</Link>
            <span>·</span>
            <Link href="/about" className="hover:underline">Dermatological Index</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Client-side route guard. The API is the real authority; this only picks the right screen. */
export function Guard({ role, children }: { role: 'BUYER' | 'SHOP_OWNER' | 'ADMIN'; children: React.ReactNode }) {
  const { me, loading, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [slow, setSlow] = useState(false);
  const target = me ? homeFor(me.role) : null;
  const mismatch = !!me && me.role !== role;

  useEffect(() => {
    if (loading) return;
    if (!me) { router.replace(`/login?next=${encodeURIComponent(path)}`); return; }
    if (mismatch && target && target !== path && !(path.startsWith(target + '/'))) router.replace(target);
  }, [loading, me, mismatch, target, router, path]);

  useEffect(() => { const t = setTimeout(() => setSlow(true), 2500); return () => clearTimeout(t); }, []);

  if (!loading && mismatch && (slow || target === path)) {
    const who = me!.role === 'BUYER' ? 'Shopper' : me!.role === 'SHOP_OWNER' ? 'Seller' : me!.role === 'ADMIN' ? 'Admin' : 'unknown';
    const need = role === 'SHOP_OWNER' ? 'Seller' : role === 'ADMIN' ? 'Admin' : 'Shopper';
    return (
      <div className="container max-w-xl py-16">
        <div className="card space-y-3 p-6 text-center">
          <h2 className="text-2xl">This area is for {need} accounts</h2>
          <p className="text-muted">You’re signed in as <strong>{me!.email}</strong> ({who} account).</p>
          <div className="flex flex-wrap justify-center gap-2">
            {target && target !== path && <Link href={target} className="btn-primary">Go to my {who === 'Shopper' ? 'account' : 'dashboard'}</Link>}
            <button className="btn-ghost" onClick={logout}>Sign out</button>
            {role === 'SHOP_OWNER' && me!.role === 'BUYER' && <Link href="/register?type=seller" className="btn-ghost">Register as seller</Link>}
          </div>
        </div>
      </div>
    );
  }
  if (loading || !me || mismatch) return (
    <div className="container py-16">
      <div className="skeleton h-40" aria-busy="true" />
      {slow && !loading && !me && <p className="mt-3 text-center text-sm text-muted">Taking you to sign in… <Link className="underline" href="/login">Click here if nothing happens</Link></p>}
    </div>
  );
  return <>{children}</>;
}

export function SideLayout({ title, links, children }: { title: string; links: [string, string][]; children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="container grid gap-6 py-8 md:grid-cols-[230px_1fr]">
      <aside>
        <h2 className="mb-3 text-xl font-serif text-[#3A0A1F]">{title}</h2>
        <nav aria-label={title} className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(([href, label]) => {
            const active = path === href || (href.split('/').length > 2 && path.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-xl px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  active ? 'bg-[#5C0F2E] text-white shadow-sm' : 'text-ink/80 hover:bg-[#FAF0F2] hover:text-[#5C0F2E]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
