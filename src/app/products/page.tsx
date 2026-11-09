'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Empty, ErrorBox, Skeleton } from '@/components/ui';
import { useFetch } from '@/lib/hooks';

const CONCERNS = ['acne', 'pigmentation', 'dryness', 'redness', 'dullness', 'ageing', 'pores'];
function List() {
  const sp = useSearchParams(); const router = useRouter();
  const q = Object.fromEntries(sp.entries());
  const { data, loading, error, reload } = useFetch<{ items: any[]; total: number; page: number; limit: number }>('/products', q);
  const cats = useFetch<{ items: any[] }>('/categories'); const brands = useFetch<{ items: any[] }>('/brands');
  const [min, setMin] = useState(q.minPrice ?? ''); const [max, setMax] = useState(q.maxPrice ?? ''); const [show, setShow] = useState(false);
  useEffect(() => { setMin(q.minPrice ?? ''); setMax(q.maxPrice ?? ''); }, [q.minPrice, q.maxPrice]);
  const set = (k: string, v?: string) => { const n = new URLSearchParams(sp.toString()); if (v) n.set(k, v); else n.delete(k); if (k !== 'page') n.delete('page'); router.push(`/products?${n.toString()}`); };
  const clear = () => router.push('/products');
  const filters = (
    <div className="space-y-5">
      <div><p className="label">Category</p><select className="input" value={q.category ?? ''} onChange={(e) => set('category', e.target.value)}><option value="">All</option>{cats.data?.items.map((c) => <option key={c._id} value={c.slug}>{c.name}</option>)}</select></div>
      <div><p className="label">Brand</p><select className="input" value={q.brand ?? ''} onChange={(e) => set('brand', e.target.value)}><option value="">All</option>{brands.data?.items.map((b) => <option key={b._id} value={b.slug}>{b.name}</option>)}</select></div>
      <div><p className="label">Price (₹)</p><div className="flex gap-2"><input className="input tnum" inputMode="numeric" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} onBlur={() => set('minPrice', min)} aria-label="Minimum price" /><input className="input tnum" inputMode="numeric" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} onBlur={() => set('maxPrice', max)} aria-label="Maximum price" /></div></div>
      <div><p className="label">Skin type</p><select className="input" value={q.skinType ?? ''} onChange={(e) => set('skinType', e.target.value)}><option value="">Any</option>{['oily', 'dry', 'combination', 'normal'].map((s) => <option key={s}>{s}</option>)}</select></div>
      <div><p className="label">Concern</p><select className="input" value={q.concern ?? ''} onChange={(e) => set('concern', e.target.value)}><option value="">Any</option>{CONCERNS.map((s) => <option key={s}>{s}</option>)}</select></div>
      <div className="grid grid-cols-2 gap-2"><div><p className="label">Shade depth</p><select className="input" value={q.depth ?? ''} onChange={(e) => set('depth', e.target.value)}><option value="">Any</option>{Array.from({ length: 10 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
        <div><p className="label">Undertone</p><select className="input" value={q.undertone ?? ''} onChange={(e) => set('undertone', e.target.value)}><option value="">Any</option>{['cool', 'neutral', 'warm', 'olive'].map((s) => <option key={s}>{s}</option>)}</select></div></div>
      {[['fragranceFree', 'Fragrance-free'], ['vegan', 'Vegan'], ['crueltyFree', 'Cruelty-free']].map(([k, l]) => <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={q[k] === 'true'} onChange={(e) => set(k, e.target.checked ? 'true' : undefined)} />{l}</label>)}
      <button className="btn-ghost btn-sm w-full" onClick={clear}>Clear all</button>
    </div>
  );
  const totalPages = data ? Math.ceil(data.total / data.limit) : 1; const page = Number(q.page ?? 1);
  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl md:text-4xl">{q.q ? `Results for “${q.q}”` : 'All products'}</h1>{data && <p className="text-muted"><span className="tnum">{data.total}</span> products</p>}</div>
        <div className="flex gap-2"><button className="btn-ghost btn-sm md:hidden" onClick={() => setShow(!show)} aria-expanded={show}>Filters</button>
          <select className="input !w-auto" aria-label="Sort" value={q.sort ?? 'relevance'} onChange={(e) => set('sort', e.target.value)}><option value="relevance">Relevance</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="newest">Newest</option><option value="popular">Popularity</option><option value="rating">Rating</option></select></div></div>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className={`${show ? 'block' : 'hidden'} md:block`} aria-label="Filters">{filters}</aside>
        <div>
          {error && <ErrorBox message={error} onRetry={reload} />}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">{loading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)}{!loading && data?.items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          {!loading && data && data.items.length === 0 && <Empty title="No products match these filters" hint="Try removing a filter or searching for a brand name." action={<button className="btn-primary" onClick={clear}>Clear filters</button>} />}
          {totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-3"><button className="btn-ghost btn-sm" disabled={page <= 1} onClick={() => set('page', String(page - 1))}>Previous</button><span className="tnum text-sm">Page {page} of {totalPages}</span><button className="btn-ghost btn-sm" disabled={page >= totalPages} onClick={() => set('page', String(page + 1))}>Next</button></div>}
        </div>
      </div>
    </div>
  );
}
export default function Page() { return <Suspense><List /></Suspense>; }
