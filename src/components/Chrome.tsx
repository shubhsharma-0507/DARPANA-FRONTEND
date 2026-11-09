'use client';
import { ChevronDown, Gem, Heart, Menu, RotateCcw, Search, ShoppingBag, Sparkles, Truck, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { homeFor, useAuth } from '@/lib/auth';
import { api, money } from '@/lib/api';
import { useSiteConfig } from '@/lib/site';

const FALLBACK_CATS = [['Skincare', 'skincare'], ['Makeup', 'makeup'], ['Fragrance', 'fragrance'], ['Hair Care', 'hair-care'], ['Nail Care', 'nail-care'], ['Beauty Sets', 'beauty-sets']];

function TopBar() {
  const cfg = useSiteConfig();
  const items = [
    [Truck, cfg ? `Free Shipping on Orders Above ${money(cfg.freeShippingAbove)}` : 'Free Shipping on Select Orders'],
    [Gem, 'Original Products from Verified Sellers'],
    [Sparkles, 'Skin Match: Shop for Your Skin Profile'],
    [RotateCcw, 'Easy Returns'],
  ] as const;
  return (
    <div className="bg-burgundy text-white">
      <div className="container grid grid-cols-1 py-2 text-[13px] md:grid-cols-4">
        {items.map(([Icon, text], i) => (
          <p key={text} className={`items-center justify-center gap-2 ${i === 0 ? 'flex' : 'hidden md:flex'} ${i > 0 ? 'md:border-l md:border-white/20' : ''}`}><Icon size={16} aria-hidden className="shrink-0 text-blush" />{text}</p>
        ))}
      </div>
    </div>
  );
}

function Dropdown({ label, items, active }: { label: string; items: [string, string][]; active?: boolean }) {
  const [open, setOpen] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const out = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', out); document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', out); document.removeEventListener('keydown', esc); };
  }, []);
  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className={`navlink inline-flex items-center gap-1 ${active ? 'text-coral' : ''}`} aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)}>{label}<ChevronDown size={14} aria-hidden className={`transition-transform ${open ? 'rotate-180' : ''}`} /></button>
      {open && <div className="absolute left-0 top-full z-50 pt-2"><ul className="card min-w-[200px] p-2">{items.map(([name, href]) => <li key={href}><Link href={href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-blush-soft hover:text-coral">{name}</Link></li>)}</ul></div>}
    </div>
  );
}

export function Header() {
  const { me, cartCount, wishlistCount, logout, loading } = useAuth();
  const router = useRouter(); const path = usePathname();
  const [q, setQ] = useState(''); const [open, setOpen] = useState(false); const [userOpen, setUserOpen] = useState(false);
  const [sugg, setSugg] = useState<{ products: any[]; brands: any[] }>({ products: [], brands: [] });
  const [cats, setCats] = useState<[string, string][]>(FALLBACK_CATS as unknown as [string, string][]);
  const userRef = useRef<HTMLDivElement>(null);
  useEffect(() => { api('/categories').then((r) => r.items?.length && setCats(r.items.map((c: any) => [c.name, c.slug]))).catch(() => {}); }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (q.trim().length < 2) { setSugg({ products: [], brands: [] }); return; }
    const t = setTimeout(() => api('/search/suggest', { query: { q } }).then(setSugg).catch(() => {}), 220);
    return () => clearTimeout(t);
  }, [q]);
  useEffect(() => { const f = (e: MouseEvent) => { if (!userRef.current?.contains(e.target as Node)) setUserOpen(false); }; document.addEventListener('mousedown', f); return () => document.removeEventListener('mousedown', f); }, []);
  const go = (e: React.FormEvent) => { e.preventDefault(); router.push(`/products?q=${encodeURIComponent(q)}`); setSugg({ products: [], brands: [] }); setOpen(false); };
  const isBuyer = !me || me.role === 'BUYER';
  const link = (href: string, label: string) => <Link href={href} className={`navlink ${path === href ? 'text-coral' : ''}`}>{label}</Link>;
  const badge = (n: number) => n > 0 && <span className="tnum absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[11px] font-semibold text-white">{n}</span>;
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="container flex items-center gap-3 py-2 lg:gap-6">
          <Link href="/" aria-label="Darpana Cosmetics home" className="shrink-0"><Image src="/logo.png" alt="Darpana Cosmetics" width={96} height={85} priority className="h-14 w-auto md:h-[68px]" /></Link>
          <nav aria-label="Main" className="ml-1 hidden items-center text-[15px] font-medium lg:flex">
            <Link href="/" className={path === '/' ? 'rounded-full bg-[#E31352] px-5 py-2 text-white shadow-card' : 'navlink'}>Home</Link>
            <Dropdown label="Shop" active={path.startsWith('/products')} items={[['All products', '/products'], ['New arrivals', '/products?sort=newest'], ['Popular', '/products?sort=popular'], ['Shade finder', '/shade-finder'], ['Skin profile', '/account/skin-profile']]} />
            <Dropdown label="Categories" items={cats.map(([n, s]) => [n, `/products?category=${s}`] as [string, string])} />
            {link('/about', 'About Us')}{link('/beauty-tips', 'Beauty Tips')}{link('/offers', 'Offers')}{link('/contact', 'Contact')}
          </nav>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <form className="relative hidden md:block" role="search" onSubmit={go}>
              <input className="h-11 w-[190px] rounded-full border border-line bg-blush-soft/60 pl-4 pr-11 text-sm placeholder:text-muted/70 focus:border-rose lg:w-[210px] xl:w-[300px]" placeholder="Search for your favourite products…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" />
              <button type="submit" aria-label="Search" className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full text-ink hover:text-coral"><Search size={18} /></button>
              {(sugg.products.length > 0 || sugg.brands.length > 0) && (
                <div className="card absolute inset-x-0 top-12 z-40 p-2">
                  {sugg.brands.map((b) => <Link key={b.slug} href={`/products?brand=${b.slug}`} onClick={() => setSugg({ products: [], brands: [] })} className="block rounded-lg px-3 py-2 text-sm hover:bg-blush-soft">{b.name} <span className="text-xs text-muted">brand</span></Link>)}
                  {sugg.products.map((p) => <Link key={p.slug} href={`/products/${p.slug}`} onClick={() => setSugg({ products: [], brands: [] })} className="block rounded-lg px-3 py-2 text-sm hover:bg-blush-soft">{p.title}</Link>)}
                </div>
              )}
            </form>
            <div ref={userRef} className="relative">
              <button className="iconbtn" aria-label="Account" aria-expanded={userOpen} onClick={() => (me || loading ? setUserOpen(!userOpen) : router.push('/login'))}><User size={22} /></button>
              {userOpen && me && <div className="card absolute right-0 top-12 z-50 w-56 p-2"><p className="truncate px-3 py-2 text-sm font-medium">{me.name}</p><p className="truncate px-3 pb-2 text-xs text-muted">{me.role === 'SHOP_OWNER' ? 'Seller' : me.role === 'ADMIN' ? 'Admin' : 'Buyer'} · {me.email}</p>
                <Link href={homeFor(me.role)} onClick={() => setUserOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-blush-soft">{me.role === 'BUYER' ? 'My account' : me.role === 'ADMIN' ? 'Admin dashboard' : 'Seller portal'}</Link>
                {me.role === 'BUYER' && <Link href="/account/orders" onClick={() => setUserOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-blush-soft">Orders</Link>}
                <button onClick={logout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-bad hover:bg-blush-soft">Sign out</button></div>}
            </div>
            {isBuyer && <Link href={me ? '/account/wishlist' : '/login'} className="iconbtn relative" aria-label={`Wishlist, ${wishlistCount} items`}><Heart size={22} />{badge(wishlistCount)}</Link>}
            {isBuyer && <Link href="/cart" className="iconbtn relative" aria-label={`Cart, ${cartCount} items`}><ShoppingBag size={22} />{badge(cartCount)}</Link>}
            {!loading && !me && <Link href="/login" className="btn-primary btn-sm hidden whitespace-nowrap xl:inline-flex">Sign in</Link>}
            {me && me.role !== 'BUYER' && <Link href={homeFor(me.role)} className="btn-plum btn-sm whitespace-nowrap">{me.role === 'ADMIN' ? 'Admin panel' : 'Seller portal'}</Link>}
            {(!me || me.role === 'BUYER') && <Link href="/register?type=seller" className="hidden whitespace-nowrap text-sm font-medium text-coral underline-offset-4 hover:underline 2xl:block">Sell on Darpana</Link>}
            <button className="iconbtn lg:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        {open && (
          <div className="container space-y-3 border-t border-line py-4 lg:hidden">
            <form onSubmit={go} className="relative"><input className="input rounded-full pr-12" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search products" /><button aria-label="Search" className="absolute right-2 top-2 h-8 w-8"><Search size={18} className="mx-auto" /></button></form>
            <div className="grid grid-cols-2 gap-2 text-sm">{[['Home', '/'], ['All products', '/products'], ['Shade finder', '/shade-finder'], ['Offers', '/offers'], ['About Us', '/about'], ['Beauty Tips', '/beauty-tips'], ['Contact', '/contact']].map(([n, h]) => <Link key={h} href={h} className="btn-ghost btn-sm">{n}</Link>)}</div>
            <p className="pt-1 text-xs font-medium uppercase tracking-wider text-muted">Categories</p>
            <div className="grid grid-cols-2 gap-2 text-sm">{cats.map(([n, s]) => <Link key={s} href={`/products?category=${s}`} className="btn-ghost btn-sm">{n}</Link>)}</div>
            {!me && <div className="grid grid-cols-2 gap-2"><Link href="/login" className="btn-primary btn-sm">Sign in</Link><Link href="/register" className="btn-ghost btn-sm">Create account</Link></div>}
            {me && me.role !== 'BUYER' && <Link href={homeFor(me.role)} className="btn-plum btn-sm w-full">{me.role === 'ADMIN' ? 'Admin panel' : 'Seller portal'}</Link>}
            {(!me || me.role === 'BUYER') && <Link href="/register?type=seller" className="btn-ghost btn-sm w-full">Sell on Darpana</Link>}
          </div>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-gradient-to-b from-white to-blush-soft">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div><Image src="/logo.png" alt="Darpana Cosmetics" width={120} height={106} className="h-20 w-auto" /><p className="mt-3 text-sm text-muted">Reflect your true beauty. Cosmetics matched to the skin you tell us about.</p></div>
        <div><h3 className="mb-2 text-base">Shop</h3><ul className="space-y-1 text-sm text-muted"><li><Link href="/products">All products</Link></li><li><Link href="/offers">Offers</Link></li><li><Link href="/shade-finder">Shade finder</Link></li><li><Link href="/account/skin-profile">Skin profile</Link></li></ul></div>
        <div><h3 className="mb-2 text-base">Company</h3><ul className="space-y-1 text-sm text-muted"><li><Link href="/about">About us</Link></li><li><Link href="/beauty-tips">Beauty tips</Link></li><li><Link href="/contact">Contact</Link></li><li><Link href="/register?type=seller">Sell on Darpana</Link></li></ul></div>
        <div><h3 className="mb-2 text-base">Good to know</h3><p className="text-sm text-muted">Skin Match compares what you share with a product’s listed ingredients. It is not medical advice. Patch-test new products and stop use if irritation occurs.</p></div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} Darpana Cosmetics</div>
    </footer>
  );
}

/** Client-side route guard. The API is the real authority; this only picks the right screen. */
export function Guard({ role, children }: { role: 'BUYER' | 'SHOP_OWNER' | 'ADMIN'; children: React.ReactNode }) {
  const { me, loading, logout } = useAuth(); const router = useRouter(); const path = usePathname();
  const [slow, setSlow] = useState(false);
  const target = me ? homeFor(me.role) : null;
  const mismatch = !!me && me.role !== role;
  useEffect(() => {
    if (loading) return;
    if (!me) { router.replace(`/login?next=${encodeURIComponent(path)}`); return; }
    // Only auto-redirect when it actually leads somewhere else (prevents redirect loops).
    if (mismatch && target && target !== path && !(path.startsWith(target + '/'))) router.replace(target);
  }, [loading, me, mismatch, target, router, path]);
  // If we are still waiting after a moment, stop showing a blank skeleton and explain.
  useEffect(() => { const t = setTimeout(() => setSlow(true), 2500); return () => clearTimeout(t); }, []);

  if (!loading && mismatch && (slow || target === path)) {
    const who = me!.role === 'BUYER' ? 'Buyer' : me!.role === 'SHOP_OWNER' ? 'Seller' : me!.role === 'ADMIN' ? 'Admin' : 'unknown';
    const need = role === 'SHOP_OWNER' ? 'Seller' : role === 'ADMIN' ? 'Admin' : 'Buyer';
    return (
      <div className="container max-w-xl py-16"><div className="card space-y-3 p-6 text-center">
        <h2 className="text-2xl">This area is for {need} accounts</h2>
        <p className="text-muted">You’re signed in as <strong>{me!.email}</strong> ({who} account).</p>
        <div className="flex flex-wrap justify-center gap-2">
          {target && target !== path && <Link href={target} className="btn-primary">Go to my {who === 'Buyer' ? 'account' : 'dashboard'}</Link>}
          <button className="btn-ghost" onClick={logout}>Sign out</button>
          {role === 'SHOP_OWNER' && me!.role === 'BUYER' && <Link href="/register?type=seller" className="btn-ghost">Register as seller</Link>}
        </div>
      </div></div>
    );
  }
  if (loading || !me || mismatch) return <div className="container py-16"><div className="skeleton h-40" aria-busy="true" />{slow && !loading && !me && <p className="mt-3 text-center text-sm text-muted">Taking you to sign in… <Link className="underline" href="/login">Click here if nothing happens</Link></p>}</div>;
  return <>{children}</>;
}

export function SideLayout({ title, links, children }: { title: string; links: [string, string][]; children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="container grid gap-6 py-8 md:grid-cols-[230px_1fr]">
      <aside><h2 className="mb-3 text-xl">{title}</h2>
        <nav aria-label={title} className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(([href, label]) => { const active = path === href || (href.split('/').length > 2 && path.startsWith(href)); return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={`whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm ${active ? 'bg-plum text-white' : 'text-ink hover:bg-plum-soft'}`}>{label}</Link>; })}
        </nav>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
