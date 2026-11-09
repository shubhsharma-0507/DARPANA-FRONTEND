'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Badge, Notice, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/hooks';

const DEPTH = ['#F6DCC8', '#F0CDB0', '#E6BC98', '#D9A97F', '#C8936A', '#B07C52', '#97653F', '#7C4F31', '#5E3A24', '#44291A'];
function Results({ items }: { items: any[] }) {
  if (!items.length) return <Notice tone="warn">We don’t have enough verified shade data yet to suggest matches.</Notice>;
  return <ol className="grid gap-3 md:grid-cols-3">{items.map((s, i) => <li key={s.variantId} className="card space-y-2 p-4"><div className="flex items-center justify-between"><span className="font-serif text-xl text-rose">#{i + 1}</span><Badge tone={s.confidence === 'High' ? 'ok' : s.confidence === 'Medium' ? 'warn' : 'plain'}>{s.confidence} confidence</Badge></div>
    <div className="flex items-center gap-2">{s.swatchHex && <span className="h-8 w-8 rounded-full border border-black/10" style={{ background: s.swatchHex }} aria-hidden />}<div><p className="font-medium">{s.name}</p><p className="text-sm text-muted">{s.brand}</p></div></div><p className="text-sm text-muted">{s.product}</p>
    <Link className="btn-ghost btn-sm" href={`/products?q=${encodeURIComponent(s.product)}`}>View product</Link></li>)}</ol>;
}
export default function ShadeFinder() {
  const { me } = useAuth(); const toast = useToast();
  const [tab, setTab] = useState<'quiz' | 'ref'>('quiz');
  const [q, setQ] = useState({ sunReaction: '', jewellery: '', veins: '', depth: 0 }); const [res, setRes] = useState<any>(null); const [busy, setBusy] = useState(false);
  const shades = useFetch<{ items: any[] }>(tab === 'ref' ? '/products' : null, { category: 'foundation-concealer', limit: 48 });
  const [refId, setRefId] = useState('');
  const detail = useFetch<any>(refId ? `/products/${refId}` : null);
  if (me && me.role !== 'BUYER') return <div className="container py-10"><Notice>The shade finder is for shopper accounts.</Notice></div>;
  async function runQuiz() { setBusy(true); try { setRes(await api('/me/shade-finder/quiz', { body: { ...q, save: true } })); } catch (e) { toast(errMsg(e), 'bad'); } finally { setBusy(false); } }
  async function runRef(variantId: string) { setBusy(true); try { setRes(await api('/me/shade-finder/reference', { body: { variantId } })); } catch (e) { toast(errMsg(e), 'bad'); } finally { setBusy(false); } }
  const R = (name: keyof typeof q, opts: [string, string][], label: string) => <fieldset className="space-y-2"><legend className="label">{label}</legend><div className="flex flex-wrap gap-2">{opts.map(([v, l]) => <button type="button" key={v} aria-pressed={q[name] === v} onClick={() => setQ({ ...q, [name]: v })} className={`min-h-[44px] rounded-full border px-4 text-sm ${q[name] === v ? 'border-plum bg-plum-soft' : 'border-line bg-white'}`}>{l}</button>)}</div></fieldset>;
  const ready = q.sunReaction && q.jewellery && q.veins && q.depth;
  return (
    <div className="container max-w-3xl space-y-6 py-10"><div><h1 className="text-3xl md:text-4xl">Shade finder</h1><p className="mt-2 text-muted">We suggest three close shades with a confidence label. No camera, and no promise: colours vary by screen.</p></div>
      {!me && <Notice>Sign in to run the shade finder. <Link href="/login?next=/shade-finder" className="underline">Sign in</Link></Notice>}
      <div className="grid grid-cols-2 gap-2 rounded-full bg-plum-soft p-1" role="tablist">{([['quiz', 'Take the quiz'], ['ref', 'I have a shade that works']] as const).map(([t, l]) => <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setRes(null); }} className={`min-h-[40px] rounded-full text-sm font-medium ${tab === t ? 'bg-white text-plum shadow-card' : 'text-muted'}`}>{l}</button>)}</div>
      {tab === 'quiz' ? <div className="card space-y-5 p-6">
        {R('sunReaction', [['burns', 'Burns easily'], ['burns_then_tans', 'Burns, then tans'], ['tans_easily', 'Tans easily'], ['rarely_burns', 'Rarely burns']], 'How does your skin react to sun?')}
        {R('jewellery', [['silver', 'Silver suits me'], ['gold', 'Gold suits me'], ['both', 'Both look good']], 'Which jewellery looks best on you?')}
        {R('veins', [['blue', 'Blue or purple'], ['green', 'Green'], ['mixed', 'Hard to tell']], 'What colour are the veins on your wrist, in daylight?')}
        <fieldset><legend className="label">Pick the swatch closest to your skin depth</legend><div className="flex flex-wrap gap-2">{DEPTH.map((c, i) => <button type="button" key={c} aria-label={`Depth ${i + 1} of 10`} aria-pressed={q.depth === i + 1} onClick={() => setQ({ ...q, depth: i + 1 })} className={`h-11 w-11 rounded-full border-2 ${q.depth === i + 1 ? 'border-plum ring-2 ring-sky' : 'border-white shadow'}`} style={{ background: c }} />)}</div><p className="mt-1 text-xs text-muted">Colours vary by screen.</p></fieldset>
        <button className="btn-primary" disabled={!ready || busy || !me} onClick={runQuiz}>{busy ? 'Finding…' : 'Find my shades'}</button></div>
      : <div className="card space-y-4 p-6"><p className="label">Choose a foundation product you already use</p>
        <select className="input" value={refId} onChange={(e) => { setRefId(e.target.value); setRes(null); }}><option value="">Select a product</option>{shades.data?.items.map((p) => <option key={p.id} value={p.slug}>{p.brand.name} – {p.title} ({money(p.price)})</option>)}</select>
        {detail.data && <div className="flex flex-wrap gap-2">{detail.data.variants.filter((v: any) => v.depth).map((v: any) => <button key={v.id} className="btn-ghost btn-sm" disabled={!me || busy} onClick={() => runRef(v.id)}>{v.name}</button>)}</div>}
        {shades.data?.items.length === 0 && <p className="text-sm text-muted">No foundations listed yet.</p>}</div>}
      {res && <section aria-live="polite" className="space-y-3"><h2 className="text-2xl">Your top 3</h2>{res.undertone && <p className="text-muted">Estimated undertone: <strong className="text-ink">{res.undertone}</strong>, depth <span className="tnum">{res.depth}</span>/10.</p>}<Results items={res.suggestions} /><p className="text-xs text-muted">{res.note}</p></section>}
    </div>
  );
}
