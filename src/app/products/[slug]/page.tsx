'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ProductImage } from '@/components/ProductCard';
import { Badge, DISCLAIMER, ErrorBox, MatchBadge, Notice, PageLoading, Stars, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/hooks';

function MatchPanel({ productId }: { productId: string }) {
  const { me } = useAuth();
  const m = useFetch<any>(me?.role === 'BUYER' ? `/me/skin-match/products/${productId}` : null);
  if (!me) return <div className="card p-5"><h3 className="text-lg">Skin Match</h3><p className="mt-1 text-muted">Sign in and share your skin profile to see how this product fits you.</p><Link href="/login" className="btn-primary btn-sm mt-3">Sign in</Link></div>;
  if (me.role !== 'BUYER') return null;
  if (m.loading) return <div className="skeleton h-40" />;
  if (m.error) return <ErrorBox message={m.error} onRetry={m.reload} />;
  if (!m.data?.available) return <div className="card p-5"><h3 className="text-lg">Skin Match</h3><p className="mt-1 text-muted">{m.data?.message}</p><Link href="/account/skin-profile" className="btn-primary btn-sm mt-3">Build my profile</Link></div>;
  const r = m.data.match;
  return (
    <section className="card space-y-3 p-5" aria-label="Skin Match result">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-lg">Skin Match</h3><MatchBadge level={r.level} score={r.score} /></div>
      <p className="text-sm text-muted">Confidence: <strong className="text-ink">{r.confidence}</strong>{r.confidence !== 'High' && ' (some profile or product data is missing or unverified)'}</p>
      {r.blocks.length > 0 && <Notice tone="bad"><strong>Not recommended for you.</strong><ul className="mt-1 list-disc pl-5">{r.blocks.map((b: string) => <li key={b}>{b}</li>)}</ul></Notice>}
      {r.warnings.length > 0 && <Notice tone="warn"><strong>Things to watch</strong><ul className="mt-1 list-disc pl-5">{r.warnings.map((b: string) => <li key={b}>{b}</li>)}</ul></Notice>}
      <ul className="space-y-1 text-sm">{r.reasons.map((x: string) => <li key={x} className="flex gap-2"><span aria-hidden className="text-rose">•</span>{x}</li>)}</ul>
      <p className="border-t border-line pt-3 text-xs text-muted">{r.disclaimer ?? DISCLAIMER}{r.doctorNote && <> <strong>{r.doctorNote}</strong></>}</p>
      <button className="text-xs text-plum underline" onClick={() => api('/me/skin-match/feedback', { body: { productId, kind: 'other' } }).then(() => alert('Thanks, we will review this match.'))}>This match seems wrong</button>
    </section>
  );
}

function Reviews({ productId, mine }: { productId: string; mine: boolean }) {
  const [twin, setTwin] = useState(false); const { me } = useAuth();
  const prof = useFetch<any>(twin && me?.role === 'BUYER' ? '/me/skin-profile' : null);
  const q: Record<string, any> = {};
  if (twin && prof.data?.profile) { const p = prof.data.profile; if (p.skinType && p.skinType !== 'not_sure') q.skinType = p.skinType; if (p.undertone) q.undertone = p.undertone; if (p.depth) q.depthGroup = p.depth <= 3 ? 'fair' : p.depth <= 6 ? 'medium' : 'deep'; }
  const { data, loading, error } = useFetch<any>(`/products/${productId}/reviews`, q);
  return (
    <section aria-label="Reviews" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-2xl">Reviews</h2>
        {me?.role === 'BUYER' && <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={twin} onChange={(e) => setTwin(e.target.checked)} />Show Skin Twin reviews</label>}</div>
      {twin && data && <Notice>{data.count} review{data.count === 1 ? '' : 's'} from shoppers with a similar skin type, depth and undertone.{data.limitedEvidence && ' That is a small sample, so treat it as a rough guide.'}</Notice>}
      {loading && <div className="skeleton h-24" />}{error && <p className="text-bad">{error}</p>}
      {data?.items.length === 0 && !loading && <p className="text-muted">No reviews yet. Only buyers with a delivered order can review.</p>}
      {data?.items.map((r: any) => <article key={r._id} className="card p-4"><div className="flex flex-wrap items-center gap-2"><Stars value={r.rating} /><Badge tone="ok">Verified purchase</Badge>{r.profileSnapshot?.skinType && <Badge tone="plum">{[r.profileSnapshot.skinType, r.profileSnapshot.depthGroup, r.profileSnapshot.undertone].filter(Boolean).join(' · ')}</Badge>}</div>{r.title && <p className="mt-2 font-medium">{r.title}</p>}{r.text && <p className="mt-1 text-muted">{r.text}</p>}
        {mine && <button className="mt-2 text-xs text-muted underline" onClick={() => api(`/reviews/${r._id}/report`, { body: { reason: 'Reported by shopper' } }).then(() => alert('Reported. Thank you.'))}>Report</button>}</article>)}
    </section>
  );
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>(); const router = useRouter(); const toast = useToast(); const { me, setCartCount } = useAuth();
  const { data, loading, error, reload } = useFetch<any>(`/products/${slug}`);
  const [variantId, setVariantId] = useState<string>(''); const [qty, setQty] = useState(1); const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(''); const [answer, setAnswer] = useState<any>(null); const [asking, setAsking] = useState(false); const [img, setImg] = useState(0);
  const offersByVariant = useMemo(() => { const m: Record<string, any[]> = {}; data?.offers.forEach((o: any) => (m[o.variantId] ??= []).push(o)); return m; }, [data]);
  useEffect(() => { if (data && !variantId) { const first = data.variants.find((v: any) => offersByVariant[v.id]) ?? data.variants[0]; if (first) setVariantId(first.id); } }, [data, variantId, offersByVariant]);
  if (loading) return <div className="container py-10"><PageLoading /></div>;
  if (error || !data) return <div className="container py-10"><ErrorBox message={error ?? 'Product not found'} onRetry={reload} /></div>;
  const p = data.product; const variant = data.variants.find((v: any) => v.id === variantId); const offers = offersByVariant[variantId] ?? []; const best = offers[0];
  const media = p.media ?? [];
  async function add(listingId: string) {
    if (!me) { router.push(`/login?next=/products/${slug}`); return; }
    if (me.role !== 'BUYER') { toast('Switch to a shopper account to buy', 'bad'); return; }
    setBusy(true);
    try { const c = await api('/cart/items', { body: { listingId, qty } }); setCartCount(c.itemCount); toast('Added to cart'); } catch (e) { toast(errMsg(e), 'bad'); } finally { setBusy(false); }
  }
  async function wish() { if (!me) return router.push('/login'); try { await api(`/wishlist/${p.id}`, { method: 'POST', body: {} }); toast('Saved to wishlist'); } catch (e) { toast(errMsg(e), 'bad'); } }
  async function question(e: React.FormEvent) { e.preventDefault(); setAsking(true); setAnswer(null); try { setAnswer(await api('/ai/product-question', { body: { productId: p.id, question: ask } })); } catch (e) { setAnswer({ answer: errMsg(e), fallback: true }); } finally { setAsking(false); } }
  return (
    <div className="container space-y-12 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted"><Link href="/products">Products</Link> / <Link href={`/products?category=${data.category?.slug}`}>{data.category?.name}</Link></nav>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="card overflow-hidden"><ProductImage src={media[img]?.url} alt={media[img]?.alt} title={p.title} /></div>
          {media.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{media.map((m: any, i: number) => <button key={i} onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} aria-current={i === img} className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${i === img ? 'border-rose' : 'border-line'}`}><ProductImage src={m.url} alt={m.alt} title={p.title} /></button>)}</div>}
        </div>
        <div className="space-y-5">
          <div><Link href={`/products?brand=${data.brand?.slug}`} className="text-sm text-rose-deep underline">{data.brand?.name}</Link><h1 className="mt-1 text-3xl md:text-4xl">{p.title}</h1>{p.ratingCount > 0 && <div className="mt-2"><Stars value={p.ratingAvg} count={p.ratingCount} /></div>}</div>
          {best ? <div className="flex flex-wrap items-baseline gap-3"><span className="tnum text-3xl font-semibold text-plum">{money(best.price)}</span>{best.mrp > best.price && <><span className="tnum text-muted line-through">{money(best.mrp)}</span><Badge tone="ok">{Math.round((1 - best.price / best.mrp) * 100)}% off</Badge></>}<span className="text-xs text-muted">Inclusive of taxes</span></div> : <Notice tone="warn">This option is currently unavailable.</Notice>}
          {data.variants.length > 1 || data.variants[0]?.kind === 'shade' ? <div><p className="label">{data.variants[0]?.kind === 'shade' ? 'Shade' : 'Size'}: <span className="font-normal text-muted">{variant?.name}</span></p>
            <div className="flex flex-wrap gap-2">{data.variants.map((v: any) => <button key={v.id} onClick={() => setVariantId(v.id)} aria-pressed={v.id === variantId} disabled={!offersByVariant[v.id]} title={offersByVariant[v.id] ? v.name : `${v.name} (out of stock)`} className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3 text-sm disabled:opacity-40 ${v.id === variantId ? 'border-plum bg-plum-soft' : 'border-line bg-white'}`}>{v.swatchHex && <span className="h-5 w-5 rounded-full border border-black/10" style={{ background: v.swatchHex }} aria-hidden />}{v.name}</button>)}</div>
            {variant?.kind === 'shade' && <p className="mt-2 text-xs text-muted">{variant.swatchVerified ? 'Colours vary by screen.' : 'Shade data is unverified. Colours vary by screen.'}{variant.depth && ` Depth ${variant.depth}/10`}{variant.undertone && `, ${variant.undertone} undertone`}</p>}</div> : null}
          {best && <div className="flex flex-wrap items-center gap-3"><div className="flex items-center rounded-full border border-line bg-white"><button className="h-11 w-11 text-lg" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="tnum w-8 text-center" aria-live="polite">{qty}</span><button className="h-11 w-11 text-lg" aria-label="Increase quantity" onClick={() => setQty(Math.min(10, qty + 1))}>+</button></div>
            <button className="btn-primary flex-1 sm:flex-none" disabled={busy} onClick={() => add(best.listingId)}>{busy ? 'Adding…' : 'Add to cart'}</button><button className="btn-ghost" onClick={wish}>Save</button></div>}
          {best && <p className="text-sm text-muted">Sold by <strong className="text-ink">{best.seller.shopName}</strong> {best.seller.verified && <Badge tone="ok">Verified seller</Badge>} · ships in {best.dispatchDays} day{best.dispatchDays === 1 ? '' : 's'} · <span className="tnum">{best.stock}</span> in stock</p>}
          {offers.length > 1 && <div className="card divide-y divide-line"><p className="p-3 text-sm font-medium">Other sellers for this option</p>{offers.slice(1).map((o) => <div key={o.listingId} className="flex items-center justify-between gap-2 p-3 text-sm"><span>{o.seller.shopName}<span className="block text-xs text-muted">ships in {o.dispatchDays}d</span></span><span className="tnum font-medium">{money(o.price)}</span><button className="btn-ghost btn-sm" onClick={() => add(o.listingId)}>Add</button></div>)}</div>}
          <MatchPanel productId={p.id} />
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {(p.shortDescription || p.description) && <section><h2 className="text-2xl">About this product</h2><p className="mt-2 whitespace-pre-line text-muted">{p.description || p.shortDescription}</p>{p.benefits?.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5">{p.benefits.map((b: string) => <li key={b}>{b}</li>)}</ul>}</section>}
          {p.usage && <section><h2 className="text-2xl">How to use</h2><p className="mt-2 whitespace-pre-line text-muted">{p.usage}</p></section>}
          <section><h2 className="text-2xl">Ingredients</h2>
            {p.ingredients?.length ? <><p className="mt-2 text-sm leading-relaxed text-muted">{p.ingredients.join(', ')}</p>{!p.ingredientsVerified && <div className="mt-2"><Notice tone="warn">Ingredient list not yet verified by Darpana.</Notice></div>}</> : <div className="mt-2"><Notice tone="warn">The full ingredient list has not been provided.</Notice></div>}
            {p.precautions && <p className="mt-3 text-sm"><strong>Precautions:</strong> {p.precautions}</p>}</section>
          <Reviews productId={p.id} mine={me?.role === 'BUYER'} />
        </div>
        <aside className="space-y-4">
          <div className="card space-y-2 p-5 text-sm"><h3 className="text-lg">Details</h3>
            {[['Finish', p.finish], ['Coverage', p.coverage], ['Texture', p.texture], ['Formulation', p.formulation], ['SPF', p.spf], ['Skin types', p.skinTypes?.join(', ')], ['Concerns', p.concerns?.join(', ')], ['Manufacturer', p.manufacturer], ['Country of origin', p.countryOfOrigin]].filter(([, v]) => v).map(([k, v]) => <div key={String(k)} className="flex justify-between gap-3"><span className="text-muted">{k}</span><span className="text-right">{String(v)}</span></div>)}
            <div className="flex flex-wrap gap-1.5 pt-2">{p.vegan && <Badge tone="ok">Vegan</Badge>}{p.crueltyFree && <Badge tone="ok">Cruelty-free</Badge>}{p.fragranceFree && <Badge>Fragrance-free</Badge>}{p.claims?.map((c: string) => <Badge key={c} tone="plum">{c}</Badge>)}</div></div>
          <form onSubmit={question} className="card space-y-2 p-5"><h3 className="text-lg">Ask about this product</h3><p className="text-xs text-muted">Answers use only this page’s approved details. Not medical advice.</p>
            <input className="input" value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="e.g. Is the finish matte?" minLength={3} maxLength={300} required aria-label="Your question" /><button className="btn-ghost btn-sm" disabled={asking}>{asking ? 'Thinking…' : 'Ask'}</button>
            {answer && <Notice>{answer.answer}</Notice>}</form>
        </aside>
      </div>
    </div>
  );
}
