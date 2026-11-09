'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ErrorBox, Field, Notice, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';
import { uploadImage } from '@/lib/upload';

const csv = (v: string) => v.split(/,|\n/).map((x) => x.trim()).filter(Boolean);
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const SKIN = ['oily', 'dry', 'combination', 'normal', 'all'];

export default function EditProduct() {
  const { id } = useParams<{ id: string }>(); const toast = useToast();
  const { data, loading, error, reload } = useFetch<any>(`/seller/products/${id}`);
  const cats = useFetch<any>('/categories'); const brands = useFetch<any>('/brands');
  const [f, setF] = useState<any>(null); const [media, setMedia] = useState<any[]>([]); const [urlIn, setUrlIn] = useState('');
  const [rows, setRows] = useState<Record<string, any>>({}); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');

  useEffect(() => {
    if (!data) return; const p = data.product;
    setF({ brandId: p.brandId, categoryId: p.categoryId, title: p.title ?? '', productType: p.productType ?? '', subcategory: p.subcategory ?? '', manufacturer: p.manufacturer ?? '', countryOfOrigin: p.countryOfOrigin ?? '',
      shortDescription: p.shortDescription ?? '', description: p.description ?? '', benefits: (p.benefits ?? []).join('\n'), usage: p.usage ?? '', precautions: p.precautions ?? '', targetAudience: p.targetAudience ?? '',
      ingredients: (p.ingredients ?? []).join(', '), allergens: (p.allergens ?? []).join(', '), fragranceFree: !!p.fragranceFree, skinTypes: p.skinTypes ?? [], concerns: (p.concerns ?? []).join(', '),
      finish: p.finish ?? '', coverage: p.coverage ?? '', texture: p.texture ?? '', formulation: p.formulation ?? '', spf: p.spf ?? '', claims: (p.claims ?? []).map((c: any) => c.text).join(', '), vegan: !!p.vegan, crueltyFree: !!p.crueltyFree,
      licence: p.regulatory?.licence ?? '', importer: p.regulatory?.importer ?? '', batchNote: p.regulatory?.batchNote ?? '' });
    setMedia((p.media ?? []).map((m: any) => ({ publicId: m.publicId, url: m.url, alt: m.alt ?? '', kind: m.kind ?? 'other' })));
    const r: Record<string, any> = {}; data.listings.forEach((l: any) => { r[l._id] = { price: String(l.price), mrp: String(l.mrp), dispatchDays: String(l.dispatchDays ?? 2), lowStockThreshold: String(l.lowStockThreshold ?? 5) }; }); setRows(r);
  }, [data]);

  const triggersReview = useMemo(() => {
    if (!data || !f) return false; const p = data.product;
    return !same(csv(f.ingredients), p.ingredients ?? []) || !same(csv(f.claims), (p.claims ?? []).map((c: any) => c.text)) || !same(csv(f.allergens), p.allergens ?? [])
      || !same({ licence: f.licence || undefined, importer: f.importer || undefined, batchNote: f.batchNote || undefined }, { licence: p.regulatory?.licence || undefined, importer: p.regulatory?.importer || undefined, batchNote: p.regulatory?.batchNote || undefined });
  }, [data, f]);

  if (loading || !f) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  const p = data.product;
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const T = (k: string, label: string, extra: any = {}) => <Field label={label}><input className="input" value={f[k]} onChange={s(k)} {...extra} /></Field>;
  const A = (k: string, label: string, hint?: string) => <Field label={label} hint={hint}><textarea className="input min-h-24" value={f[k]} onChange={s(k)} /></Field>;

  async function addImage(file?: File) { if (!file) return; try { const r = await uploadImage(file, 'product'); setMedia((m) => [...m, { publicId: r.publicId, url: r.url!, alt: '', kind: m.length === 0 ? 'front' : 'other' }]); } catch (e) { toast(errMsg(e), 'bad'); } }
  async function save() {
    if (triggersReview && !confirm('You changed ingredients, claims, allergens or regulatory details. The product goes back to admin review and is hidden from the store until approved again. Continue?')) return;
    setBusy(true); setErr('');
    const body: any = { brandId: f.brandId, categoryId: f.categoryId, title: f.title, productType: f.productType, subcategory: f.subcategory, manufacturer: f.manufacturer, countryOfOrigin: f.countryOfOrigin,
      shortDescription: f.shortDescription, description: f.description, benefits: csv(f.benefits), usage: f.usage, precautions: f.precautions, targetAudience: f.targetAudience,
      ingredients: csv(f.ingredients), allergens: csv(f.allergens), fragranceFree: f.fragranceFree, skinTypes: f.skinTypes, concerns: csv(f.concerns),
      finish: f.finish, coverage: f.coverage, texture: f.texture, formulation: f.formulation, claims: csv(f.claims), vegan: f.vegan, crueltyFree: f.crueltyFree,
      regulatory: { licence: f.licence || undefined, importer: f.importer || undefined, batchNote: f.batchNote || undefined },
      media: media.map((m) => ({ ...m, alt: m.alt && m.alt.length >= 3 ? m.alt : `${f.title} ${m.kind}` })) };
    if (f.spf !== '' && f.spf != null) body.spf = Number(f.spf);
    try { const r = await api(`/seller/products/${id}`, { method: 'PATCH', body }); toast(r.sentForReview ? 'Saved. Sent to admin for re-review' : 'Changes saved'); reload(); }
    catch (e: any) { const fe = e?.fieldErrors; setErr(fe ? Object.entries(fe).map(([k, v]) => `${k}: ${(v as string[])[0]}`).join(' · ') : errMsg(e)); } finally { setBusy(false); }
  }
  async function saveRow(listingId: string) {
    const r = rows[listingId];
    try { await api(`/seller/listings/${listingId}`, { method: 'PATCH', body: { price: Number(r.price), mrp: Number(r.mrp), dispatchDays: Number(r.dispatchDays), lowStockThreshold: Number(r.lowStockThreshold) } }); toast('Price and dispatch updated'); reload(); }
    catch (e) { toast(errMsg(e), 'bad'); }
  }
  const setRow = (id2: string, k: string, v: string) => setRows({ ...rows, [id2]: { ...rows[id2], [k]: v } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><Link href="/seller/products" className="text-sm text-coral underline">← All products</Link><h1 className="mt-1 text-3xl md:text-4xl">Edit product</h1></div><StatusBadge s={p.approvalStatus} /></div>
      {p.reviewNote && <Notice tone="warn">Note from admin: {p.reviewNote}</Notice>}
      {p.approvalStatus === 'approved' && <Notice>This product is live. Price, stock, description and images update immediately. Changing ingredients, claims, allergens or regulatory details sends it back to admin review.</Notice>}

      <section className="card space-y-4 p-5"><h2 className="text-xl">Price, dispatch and stock</h2>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="py-2">Variant</th><th>MRP (₹)</th><th>Price (₹)</th><th>Dispatch (days)</th><th>Stock</th><th /></tr></thead>
          <tbody>{data.listings.map((l: any) => { const v = data.variants.find((x: any) => String(x._id) === String(l.variantId)); const r = rows[l._id]; if (!r) return null; return (
            <tr key={l._id} className="border-b border-line last:border-0"><td className="py-2 pr-2">{v?.name}<span className="block text-xs text-muted">SKU {l.sku} · <StatusBadge s={l.status} /></span></td>
              <td className="pr-2"><input className="input tnum !min-h-[40px] !w-24" inputMode="decimal" value={r.mrp} onChange={(e) => setRow(l._id, 'mrp', e.target.value)} aria-label={`MRP for ${v?.name}`} /></td>
              <td className="pr-2"><input className="input tnum !min-h-[40px] !w-24" inputMode="decimal" value={r.price} onChange={(e) => setRow(l._id, 'price', e.target.value)} aria-label={`Price for ${v?.name}`} /></td>
              <td className="pr-2"><input className="input tnum !min-h-[40px] !w-20" inputMode="numeric" value={r.dispatchDays} onChange={(e) => setRow(l._id, 'dispatchDays', e.target.value)} aria-label={`Dispatch days for ${v?.name}`} /></td>
              <td className="tnum pr-2">{l.availableQty}<Link href="/seller/inventory" className="ml-2 text-xs text-coral underline">adjust</Link></td>
              <td><button className="btn-plum btn-sm" disabled={Number(r.price) > Number(r.mrp) || !Number(r.price)} onClick={() => saveRow(l._id)}>Save</button></td></tr>); })}</tbody></table></div>
        <p className="text-xs text-muted">Selling price can’t be higher than MRP. Current: {data.listings.map((l: any) => money(l.price)).join(' · ')}</p></section>

      <section className="card space-y-4 p-5"><h2 className="text-xl">Product details</h2>
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Brand"><select className="input" value={f.brandId} onChange={s('brandId')}>{brands.data?.items.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></Field>
          <Field label="Category"><select className="input" value={f.categoryId} onChange={s('categoryId')}>{cats.data?.items.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></Field>
          <div className="sm:col-span-2">{T('title', 'Product title')}</div>{T('productType', 'Product type')}{T('subcategory', 'Subcategory')}{T('manufacturer', 'Manufacturer')}{T('countryOfOrigin', 'Country of origin')}</div>
        {T('shortDescription', 'Short description', { maxLength: 300 })}{A('description', 'Detailed description')}{A('benefits', 'Key benefits', 'One per line')}{A('usage', 'How to use')}{A('precautions', 'Precautions')}{T('targetAudience', 'Target audience')}</section>

      <section className="card space-y-4 p-5"><h2 className="text-xl">Ingredients and suitability</h2>
        {A('ingredients', 'Full ingredient list (INCI)', 'Exactly as printed on the pack, in order, separated by commas.')}{T('allergens', 'Allergen declarations')}
        <fieldset><legend className="label">Suitable skin types</legend><div className="flex flex-wrap gap-2">{SKIN.map((v) => <button type="button" key={v} aria-pressed={f.skinTypes.includes(v)} onClick={() => setF({ ...f, skinTypes: f.skinTypes.includes(v) ? f.skinTypes.filter((x: string) => x !== v) : [...f.skinTypes, v] })} className={`min-h-[44px] rounded-full border px-4 text-sm capitalize ${f.skinTypes.includes(v) ? 'border-plum bg-plum-soft' : 'border-line'}`}>{v}</button>)}</div></fieldset>
        {T('concerns', 'Concerns it targets')}<div className="grid gap-4 sm:grid-cols-2">{T('finish', 'Finish')}{T('coverage', 'Coverage')}{T('texture', 'Texture')}{T('formulation', 'Formulation type')}{T('spf', 'SPF (if any)', { inputMode: 'numeric' })}</div>
        {T('claims', 'Claims (shown to shoppers only after admin verifies evidence)')}
        <div className="flex flex-wrap gap-6">{([['fragranceFree', 'Fragrance-free'], ['vegan', 'Vegan'], ['crueltyFree', 'Cruelty-free']] as const).map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.checked })} />{l}</label>)}</div>
        <div className="grid gap-4 sm:grid-cols-2">{T('licence', 'Licence / registration number')}{T('importer', 'Importer details')}</div>{T('batchNote', 'Batch & expiry note')}</section>

      <section className="card space-y-3 p-5"><h2 className="text-xl">Images</h2>
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => addImage(e.target.files?.[0])} aria-label="Upload product image" />
        <div className="flex gap-2"><input className="input" placeholder="…or paste an https image URL" value={urlIn} onChange={(e) => setUrlIn(e.target.value)} /><button className="btn-ghost" onClick={() => { if (/^https:\/\//.test(urlIn)) { setMedia([...media, { publicId: 'external:' + Date.now(), url: urlIn, alt: '', kind: 'other' }]); setUrlIn(''); } }}>Add URL</button></div>
        <ul className="grid gap-3 sm:grid-cols-2">{media.map((m, i) => <li key={m.publicId + i} className="flex gap-3 rounded-xl border border-line p-3"><img src={m.url} alt="" className="h-20 w-20 rounded-lg object-cover" /><div className="flex-1 space-y-2"><input className="input" placeholder="Describe the image (alt text)" value={m.alt} onChange={(e) => setMedia(media.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} aria-label="Image alt text" /><div className="flex items-center gap-3"><select className="input" value={m.kind} onChange={(e) => setMedia(media.map((x, j) => (j === i ? { ...x, kind: e.target.value } : x)))} aria-label="Image type">{['front', 'back', 'texture', 'in_use', 'other'].map((k) => <option key={k}>{k}</option>)}</select>{i > 0 && <button className="text-xs underline" onClick={() => setMedia(media.map((x, j) => (j === i ? media[i - 1] : j === i - 1 ? media[i] : x)))}>Move up</button>}<button className="text-xs text-bad underline" onClick={() => setMedia(media.filter((_, j) => j !== i))}>Remove</button></div></div></li>)}</ul>
        <p className="text-xs text-muted">The first image is the main image.</p></section>

      {triggersReview && <Notice tone="warn"><strong>Heads up:</strong> your changes to ingredients, claims, allergens or regulatory details will send this product back to admin review.</Notice>}
      {err && <Notice tone="bad">{err}</Notice>}
      <div className="sticky bottom-3 z-10 flex gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-card backdrop-blur"><button className="btn-primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save changes'}</button><Link href="/seller/products" className="btn-ghost">Cancel</Link></div>
    </div>
  );
}
