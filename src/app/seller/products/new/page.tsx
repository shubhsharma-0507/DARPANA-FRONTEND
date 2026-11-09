'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Field, Notice, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { uploadImage } from '@/lib/upload';
import { useFetch } from '@/lib/hooks';

const DRAFT_KEY = 'darpana_product_draft_v1';
const emptyVariant = { name: '', kind: 'size', depth: '', undertone: '', sku: '', mrp: '', price: '', stock: '', dispatchDays: '2' };
const STEPS = ['Identity', 'Description', 'Ingredients', 'Suitability', 'Variants & pricing', 'Logistics & regulatory', 'Images', 'Review'];
const csv = (v: string) => v.split(',').map((x) => x.trim()).filter(Boolean);

export default function NewProduct() {
  const router = useRouter(); const toast = useToast();
  const cats = useFetch<any>('/categories'); const brands = useFetch<any>('/brands');
  const [step, setStep] = useState(0); const [busy, setBusy] = useState(false); const [err, setErr] = useState('');
  const [f, setF] = useState<any>({ brandId: '', categoryId: '', title: '', productType: '', subcategory: '', manufacturer: '', countryOfOrigin: '', shortDescription: '', description: '', benefits: '', usage: '', precautions: '', targetAudience: '', ingredients: '', allergens: '', fragranceFree: false, skinTypes: [] as string[], concerns: '', finish: '', coverage: '', texture: '', formulation: '', spf: '', claims: '', vegan: false, crueltyFree: false, licence: '', importer: '', batchNote: '' });
  const [variants, setVariants] = useState<any[]>([{ ...emptyVariant }]); const [media, setMedia] = useState<{ publicId: string; url: string; alt: string; kind: string }[]>([]); const [urlIn, setUrlIn] = useState('');
  useEffect(() => { try { const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null'); if (d) { setF(d.f); setVariants(d.variants); setMedia(d.media ?? []); } } catch { /* ignore */ } }, []);
  useEffect(() => { const t = setTimeout(() => { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ f, variants, media })); } catch { /* ignore */ } }, 600); return () => clearTimeout(t); }, [f, variants, media]);
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const tick = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.checked });
  const setV = (i: number, k: string, v: string) => setVariants(variants.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  async function addImage(file?: File) { if (!file) return; try { const r = await uploadImage(file, 'product'); setMedia((m) => [...m, { publicId: r.publicId, url: r.url!, alt: '', kind: m.length === 0 ? 'front' : 'other' }]); } catch (e) { toast(errMsg(e), 'bad'); } }
  const num = (v: string) => (v === '' ? undefined : Number(v));
  async function save() {
    setBusy(true); setErr('');
    const body: any = { brandId: f.brandId, categoryId: f.categoryId, title: f.title, productType: f.productType || undefined, subcategory: f.subcategory || undefined, manufacturer: f.manufacturer || undefined, countryOfOrigin: f.countryOfOrigin || undefined,
      shortDescription: f.shortDescription || undefined, description: f.description || undefined, benefits: csv(f.benefits.replace(/\n/g, ',')), usage: f.usage || undefined, precautions: f.precautions || undefined, targetAudience: f.targetAudience || undefined,
      ingredients: csv(f.ingredients.replace(/\n/g, ',')), allergens: csv(f.allergens), fragranceFree: f.fragranceFree, skinTypes: f.skinTypes, concerns: csv(f.concerns), finish: f.finish || undefined, coverage: f.coverage || undefined, texture: f.texture || undefined, formulation: f.formulation || undefined, spf: num(f.spf),
      claims: csv(f.claims), vegan: f.vegan, crueltyFree: f.crueltyFree, regulatory: { licence: f.licence || undefined, importer: f.importer || undefined, batchNote: f.batchNote || undefined },
      media: media.map((m) => ({ ...m, alt: m.alt || `${f.title} ${m.kind}` })),
      variants: variants.map((v) => ({ name: v.name, kind: v.kind, depth: num(v.depth), undertone: v.undertone || undefined, sku: v.sku, mrp: Number(v.mrp), price: Number(v.price), stock: Number(v.stock), dispatchDays: Number(v.dispatchDays || 2) })) };
    try { await api('/seller/products', { body }); localStorage.removeItem(DRAFT_KEY); toast('Draft saved'); router.push('/seller/products'); }
    catch (e: any) { const fe = e?.fieldErrors; setErr(fe ? Object.entries(fe).map(([k, v]) => `${k}: ${(v as string[])[0]}`).join(' · ') : errMsg(e)); } finally { setBusy(false); }
  }
  const T = (k: string, label: string, p: any = {}) => <Field label={label}><input className="input" value={f[k]} onChange={s(k)} {...p} /></Field>;
  const A = (k: string, label: string, hint?: string) => <Field label={label} hint={hint}><textarea className="input min-h-24" value={f[k]} onChange={s(k)} /></Field>;
  const missing = [!f.ingredients.trim() && 'Full ingredient list (needed for Skin Match)', !media.length && 'At least one image', !f.brandId && 'Brand', !f.categoryId && 'Category', f.title.length < 3 && 'Title'].filter(Boolean);
  return (
    <div className="space-y-5"><div><h1 className="text-3xl md:text-4xl">Add product</h1><p className="text-sm text-muted">Your progress is saved on this device as you type.</p></div>
      <ol className="flex flex-wrap gap-2" aria-label="Steps">{STEPS.map((n, i) => <li key={n}><button onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined} className={`min-h-[40px] rounded-full border px-3 text-sm ${i === step ? 'border-plum bg-plum text-white' : 'border-line bg-white'}`}>{n}</button></li>)}</ol>
      <div className="card space-y-4 p-5">
        {step === 0 && <div className="grid gap-4 sm:grid-cols-2"><Field label="Brand"><select className="input" value={f.brandId} onChange={s('brandId')}><option value="">Select</option>{brands.data?.items.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></Field>
          <Field label="Category"><select className="input" value={f.categoryId} onChange={s('categoryId')}><option value="">Select</option>{cats.data?.items.map((b: any) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></Field>
          <div className="sm:col-span-2">{T('title', 'Product title')}</div>{T('productType', 'Product type')}{T('subcategory', 'Subcategory')}{T('manufacturer', 'Manufacturer')}{T('countryOfOrigin', 'Country of origin')}</div>}
        {step === 1 && <>{T('shortDescription', 'Short description', { maxLength: 300 })}{A('description', 'Detailed description')}{A('benefits', 'Key benefits', 'One per line')}{A('usage', 'How to use')}{A('precautions', 'Precautions')}{T('targetAudience', 'Target audience')}</>}
        {step === 2 && <>{A('ingredients', 'Full ingredient list (INCI)', 'Copy it exactly as printed on the pack, in order, separated by commas. Required to enable Skin Match.')}{T('allergens', 'Allergen declarations', { placeholder: 'comma separated' })}<label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={f.fragranceFree} onChange={tick('fragranceFree')} />Fragrance-free</label>
          <Notice tone="warn">Ingredients are verified by our team before Skin Match uses them. Editing them later triggers re-review.</Notice></>}
        {step === 3 && <><fieldset><legend className="label">Suitable skin types</legend><div className="flex flex-wrap gap-2">{['oily', 'dry', 'combination', 'normal', 'all'].map((v) => <button type="button" key={v} aria-pressed={f.skinTypes.includes(v)} onClick={() => setF({ ...f, skinTypes: f.skinTypes.includes(v) ? f.skinTypes.filter((x: string) => x !== v) : [...f.skinTypes, v] })} className={`min-h-[44px] rounded-full border px-4 text-sm capitalize ${f.skinTypes.includes(v) ? 'border-plum bg-plum-soft' : 'border-line'}`}>{v}</button>)}</div></fieldset>
          {T('concerns', 'Concerns it targets', { placeholder: 'acne, dryness, pores…' })}<div className="grid gap-4 sm:grid-cols-2">{T('finish', 'Finish')}{T('coverage', 'Coverage')}{T('texture', 'Texture')}{T('formulation', 'Formulation type')}{T('spf', 'SPF (if any)', { inputMode: 'numeric' })}</div>
          {T('claims', 'Claims (hypoallergenic, non-comedogenic, …)', { placeholder: 'comma separated' })}<p className="text-xs text-muted">Claims show to shoppers only after our team verifies your evidence.</p>
          <div className="flex gap-6"><label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={f.vegan} onChange={tick('vegan')} />Vegan</label><label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={f.crueltyFree} onChange={tick('crueltyFree')} />Cruelty-free</label></div></>}
        {step === 4 && <div className="space-y-4"><Notice>Add one row per shade or size. Shade depth and undertone stay <strong>unverified</strong> until our team confirms them with brand data.</Notice>
          {variants.map((v, i) => <div key={i} className="grid gap-3 rounded-xl border border-line p-4 sm:grid-cols-4"><Field label="Name"><input className="input" value={v.name} onChange={(e) => setV(i, 'name', e.target.value)} placeholder="Warm Beige 220 / 30 ml" /></Field>
            <Field label="Type"><select className="input" value={v.kind} onChange={(e) => setV(i, 'kind', e.target.value)}><option value="size">Size</option><option value="shade">Shade</option></select></Field>
            {v.kind === 'shade' && <><Field label="Depth (1–10)"><input className="input tnum" inputMode="numeric" value={v.depth} onChange={(e) => setV(i, 'depth', e.target.value)} /></Field><Field label="Undertone"><select className="input" value={v.undertone} onChange={(e) => setV(i, 'undertone', e.target.value)}><option value="">Select</option>{['cool', 'neutral', 'warm', 'olive'].map((u) => <option key={u}>{u}</option>)}</select></Field></>}
            <Field label="SKU"><input className="input" value={v.sku} onChange={(e) => setV(i, 'sku', e.target.value)} /></Field><Field label="MRP (₹)"><input className="input tnum" inputMode="decimal" value={v.mrp} onChange={(e) => setV(i, 'mrp', e.target.value)} /></Field><Field label="Selling price (₹)"><input className="input tnum" inputMode="decimal" value={v.price} onChange={(e) => setV(i, 'price', e.target.value)} /></Field><Field label="Stock"><input className="input tnum" inputMode="numeric" value={v.stock} onChange={(e) => setV(i, 'stock', e.target.value)} /></Field><Field label="Dispatch (days)"><input className="input tnum" inputMode="numeric" value={v.dispatchDays} onChange={(e) => setV(i, 'dispatchDays', e.target.value)} /></Field>
            {variants.length > 1 && <button className="text-sm text-bad underline sm:col-span-4 sm:text-left" onClick={() => setVariants(variants.filter((_, j) => j !== i))}>Remove this variant</button>}</div>)}
          <button className="btn-ghost btn-sm" onClick={() => setVariants([...variants, { ...emptyVariant }])}>Add another variant</button></div>}
        {step === 5 && <><div className="grid gap-4 sm:grid-cols-2">{T('licence', 'Licence / registration number')}{T('importer', 'Importer details (if imported)')}</div>{T('batchNote', 'Batch & expiry handling note')}<Notice>Package weight, dimensions and shipping restrictions are managed per shipment in this release. Return eligibility follows Darpana’s policy.</Notice></>}
        {step === 6 && <div className="space-y-3"><p className="text-sm text-muted">Recommended: front, back/ingredients, texture and in-use. JPEG, PNG or WebP up to 5 MB, square works best.</p>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => addImage(e.target.files?.[0])} aria-label="Upload product image" />
          <div className="flex gap-2"><input className="input" placeholder="…or paste an https image URL" value={urlIn} onChange={(e) => setUrlIn(e.target.value)} /><button className="btn-ghost" onClick={() => { if (/^https:\/\//.test(urlIn)) { setMedia([...media, { publicId: 'external:' + Date.now(), url: urlIn, alt: '', kind: 'other' }]); setUrlIn(''); } }}>Add URL</button></div>
          <ul className="grid gap-3 sm:grid-cols-2">{media.map((m, i) => <li key={m.publicId} className="flex gap-3 rounded-xl border border-line p-3"><img src={m.url} alt="" className="h-20 w-20 rounded-lg object-cover" /><div className="flex-1 space-y-2"><input className="input" placeholder="Describe the image (alt text)" value={m.alt} onChange={(e) => setMedia(media.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))} aria-label="Image alt text" /><select className="input" value={m.kind} onChange={(e) => setMedia(media.map((x, j) => (j === i ? { ...x, kind: e.target.value } : x)))} aria-label="Image type">{['front', 'back', 'texture', 'in_use', 'other'].map((k) => <option key={k}>{k}</option>)}</select><button className="text-xs text-bad underline" onClick={() => setMedia(media.filter((_, j) => j !== i))}>Remove</button></div></li>)}</ul></div>}
        {step === 7 && <div className="space-y-3"><h2 className="text-xl">{f.title || 'Untitled product'}</h2>{missing.length > 0 ? <Notice tone="warn"><strong>Before you can submit for review:</strong><ul className="list-disc pl-5">{missing.map((m) => <li key={String(m)}>{m}</li>)}</ul>You can still save this as a draft.</Notice> : <Notice tone="ok">Looks complete. Save the draft, then submit it for review from your products list.</Notice>}
          <p className="text-sm text-muted">{variants.length} variant(s) · {media.length} image(s) · {csv(f.ingredients.replace(/\n/g, ',')).length} ingredients</p>
          {err && <Notice tone="bad">{err}</Notice>}<button className="btn-primary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save draft'}</button></div>}
      </div>
      <div className="flex gap-3">{step > 0 && <button className="btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}{step < STEPS.length - 1 && <button className="btn-plum" onClick={() => setStep(step + 1)}>Next</button>}</div></div>
  );
}
