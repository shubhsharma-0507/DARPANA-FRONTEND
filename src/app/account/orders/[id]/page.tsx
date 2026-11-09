'use client';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ErrorBox, Field, Modal, Notice, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

const REASONS = [['wrong_item', 'Wrong item'], ['damaged_item', 'Damaged item'], ['defective_item', 'Defective item'], ['missing_item', 'Missing item'], ['shade_mismatch', 'Shade mismatch'], ['did_not_suit', 'Did not suit my skin']];
function Detail() {
  const { id } = useParams<{ id: string }>(); const placed = useSearchParams().get('placed'); const toast = useToast();
  const { data, loading, error, reload } = useFetch<any>(`/orders/${id}`);
  const [ret, setRet] = useState<any>(null); const [rev, setRev] = useState<any>(null); const [reason, setReason] = useState('shade_mismatch'); const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5); const [title, setTitle] = useState(''); const [text, setText] = useState(''); const [snap, setSnap] = useState(false);
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  const o = data.order; const canCancel = data.shipments.every((s: any) => ['pending_acceptance', 'accepted', 'packing'].includes(s.status)) && !['cancelled', 'pending_payment'].includes(o.status);
  async function cancel() { if (!confirm('Cancel this whole order? Your refund will start right away.')) return; try { await api(`/orders/${id}/cancel`, { body: {} }); toast('Order cancelled'); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  async function sendReturn() { try { await api('/returns', { body: { subOrderId: ret.sub, orderItemId: ret.item, reason, comment: comment || undefined } }); toast('Return requested'); setRet(null); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  async function sendReview() { try { await api(`/products/${rev.productId}/reviews`, { body: { orderItemId: rev.item, rating, title: title || undefined, text: text || undefined, includeProfileSnapshot: snap } }); toast('Thanks for your review'); setRev(null); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <div className="space-y-5">
    {placed && <Notice tone="ok"><strong>Order placed.</strong> We’ve sent the details to the sellers.</Notice>}
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h1 className="text-3xl md:text-4xl">{o.orderNumber}</h1><p className="text-muted">{new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p></div><div className="flex items-center gap-2"><StatusBadge s={o.status} /><StatusBadge s={o.paymentStatus} /></div></div>
    {data.shipments.map((s: any, i: number) => <section key={s.id} className="card"><div className="flex flex-wrap items-center justify-between gap-2 border-b border-line p-4"><p className="font-medium">Shipment {i + 1} · {s.seller}</p><StatusBadge s={s.status} /></div>
      {s.shipping?.trackingId && <p className="px-4 pt-3 text-sm">Tracking: <strong>{s.shipping.courier}</strong> <span className="tnum">{s.shipping.trackingId}</span></p>}
      <ul className="divide-y divide-line">{s.items.map((it: any) => <li key={it._id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-medium">{it.title}</p><p className="text-sm text-muted">{it.variantName} · Qty <span className="tnum">{it.qty}</span></p></div><div className="flex items-center gap-2"><span className="tnum">{money(it.lineTotal)}</span>
        {s.status === 'delivered' && <><button className="btn-ghost btn-sm" onClick={() => setRev({ item: it._id, productId: it.productId })}>Review</button><button className="btn-ghost btn-sm" onClick={() => setRet({ sub: s.id, item: it._id })}>Return</button></>}</div></li>)}</ul>
      <ol className="space-y-1 border-t border-line p-4 text-xs text-muted">{(s.timeline ?? []).map((t: any, k: number) => <li key={k}>{new Date(t.at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })} · {t.status.replace(/_/g, ' ')}{t.note ? ` (${t.note})` : ''}</li>)}</ol></section>)}
    <div className="card space-y-1 p-4 text-sm"><div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tnum">{money(o.subtotal)}</span></div><div className="flex justify-between"><span className="text-muted">Delivery</span><span className="tnum">{money(o.shipping)}</span></div>{o.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span className="tnum">−{money(o.discount)}</span></div>}<div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><span>Total</span><span className="tnum">{money(o.total)}</span></div>
      <p className="pt-2 text-muted">Delivering to {o.address?.fullName}, {o.address?.line1}, {o.address?.city} {o.address?.pincode}</p></div>
    {canCancel && <button className="btn-ghost" onClick={cancel}>Cancel order</button>}
    <Link href="/account/orders" className="text-sm text-plum underline">All orders</Link>
    <Modal open={!!ret} onClose={() => setRet(null)} title="Request a return"><div className="space-y-3"><Notice>Opened cosmetics may not be returnable for hygiene reasons unless damaged, defective or wrong. Our team reviews every request.</Notice>
      <Field label="Reason"><select className="input" value={reason} onChange={(e) => setReason(e.target.value)}>{REASONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></Field><Field label="Details (optional)"><textarea className="input min-h-24" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} /></Field><button className="btn-primary" onClick={sendReturn}>Submit request</button></div></Modal>
    <Modal open={!!rev} onClose={() => setRev(null)} title="Write a review"><div className="space-y-3"><Field label="Rating"><div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-label={`${n} star${n > 1 ? 's' : ''}`} aria-pressed={rating === n} onClick={() => setRating(n)} className={`h-11 w-11 text-2xl ${n <= rating ? 'text-rose' : 'text-line'}`}>★</button>)}</div></Field>
      <Field label="Title (optional)"><input className="input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} /></Field><Field label="Your review"><textarea className="input min-h-24" maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} /></Field>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#BB1042]" checked={snap} onChange={(e) => setSnap(e.target.checked)} />Show my skin type, depth and undertone group (no name or health details) so similar shoppers can find this review.</label><button className="btn-primary" onClick={sendReview}>Post review</button></div></Modal>
  </div>;
}
export default function Page() { return <Suspense><Detail /></Suspense>; }
