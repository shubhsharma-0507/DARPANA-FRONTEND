'use client';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Guard } from '@/components/Chrome';
import { AddressForm } from '@/components/AddressForm';
import { Empty, ErrorBox, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/hooks';

declare global { interface Window { Razorpay?: any } }

function Checkout() {
  const router = useRouter(); const toast = useToast(); const { setCartCount } = useAuth();
  const addrs = useFetch<any>('/me/addresses');
  const [addressId, setAddressId] = useState(''); const [coupon, setCoupon] = useState(''); const [applied, setApplied] = useState('');
  const [sum, setSum] = useState<any>(null); const [err, setErr] = useState(''); const [ack, setAck] = useState(false); const [busy, setBusy] = useState(false); const [adding, setAdding] = useState(false);
  const idem = useRef(typeof crypto !== 'undefined' ? crypto.randomUUID() : String(Math.random()));
  async function prepare(c?: string) { try { setErr(''); const s = await api('/checkout/prepare', { body: { couponCode: c || undefined } }); setSum(s); setApplied(s.couponCode ?? ''); } catch (e) { setErr(errMsg(e)); } }
  useEffect(() => { prepare(); }, []);
  useEffect(() => { if (addrs.data?.items.length && !addressId) setAddressId((addrs.data.items.find((a: any) => a.isDefault) ?? addrs.data.items[0])._id); }, [addrs.data, addressId]);
  if (!sum && !err) return <div className="container py-10"><PageLoading /></div>;
  if (sum && sum.total === 0 && !sum.problems.length) return <div className="container py-10"><Empty title="Your cart is empty" /></div>;

  async function place() {
    setBusy(true); setErr('');
    try {
      const r = await api('/orders', { body: { addressId, couponCode: applied || undefined, acknowledgeNotRecommended: ack || undefined, idempotencyKey: idem.current } });
      const done = (id: string) => { setCartCount(0); router.replace(`/account/orders/${id}?placed=1`); };
      if (r.mode === 'demo') { const d = await api('/payments/demo-confirm', { body: { orderId: r.order.id } }); done(d.orderId); return; }
      if (!window.Razorpay) throw new Error('Payment window did not load. Please refresh and try again.');
      const rz = new window.Razorpay({ key: r.payment.keyId, amount: r.payment.amount, currency: 'INR', order_id: r.payment.razorpayOrderId, name: 'Darpana Cosmetics', description: `Order ${r.order.orderNumber}`, theme: { color: '#5B2A44' },
        handler: async (resp: any) => { try { const v = await api('/payments/verify', { body: resp }); done(v.orderId); } catch (e) { setErr(errMsg(e)); setBusy(false); } },
        modal: { ondismiss: () => setBusy(false) } });
      rz.on('payment.failed', () => { setErr('Payment failed. You can try again.'); setBusy(false); idem.current = crypto.randomUUID(); });
      rz.open();
    } catch (e: any) { setErr(e?.message ?? 'Could not place your order'); if (e?.code === 'MATCH_ACK_REQUIRED') setAck(false); setBusy(false); }
  }
  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_360px]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="space-y-6"><h1 className="text-3xl md:text-4xl">Checkout</h1>
        {err && <Notice tone="bad">{err}</Notice>}
        {sum?.problems.map((p: string) => <Notice key={p} tone="warn">{p}</Notice>)}
        <section className="card p-5"><div className="mb-3 flex items-center justify-between"><h2 className="text-xl">Delivery address</h2><button className="btn-ghost btn-sm" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : 'Add new'}</button></div>
          {addrs.error && <ErrorBox message={addrs.error} onRetry={addrs.reload} />}
          {adding ? <AddressForm onSaved={async () => { setAdding(false); await addrs.reload(); }} /> : <div className="grid gap-3 sm:grid-cols-2">{addrs.data?.items.map((a: any) => <label key={a._id} className={`cursor-pointer rounded-xl border p-4 text-sm ${addressId === a._id ? 'border-plum bg-plum-soft' : 'border-line'}`}><input type="radio" name="addr" className="mr-2 accent-[#5B2A44]" checked={addressId === a._id} onChange={() => setAddressId(a._id)} /><strong>{a.fullName}</strong><br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}, {a.state} <span className="tnum">{a.pincode}</span><br /><span className="tnum text-muted">{a.phone}</span></label>)}{addrs.data?.items.length === 0 && <p className="text-muted">Add a delivery address to continue.</p>}</div>}
        </section>
        <section className="card p-5"><h2 className="mb-3 text-xl">Coupon</h2><div className="flex gap-2"><input className="input" placeholder="Enter code" value={coupon} onChange={(e) => setCoupon(e.target.value)} aria-label="Coupon code" /><button className="btn-ghost" onClick={() => prepare(coupon)}>Apply</button></div>{applied && <p className="mt-2 text-sm text-ok">{applied} applied</p>}</section>
        {sum?.notRecommended?.length > 0 && <Notice tone="bad"><strong>Skin Match warning</strong><p className="mt-1">These items are marked Not recommended for your profile: {sum.notRecommended.join(', ')}.</p><label className="mt-2 flex items-start gap-2"><input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#B42318]" checked={ack} onChange={(e) => setAck(e.target.checked)} />I have read the reasons and still want to buy these items.</label></Notice>}
        {sum?.paymentMode === 'demo' && <Notice tone="warn">Demo payment mode: no real money is charged. Add Razorpay keys to the API to enable live payments.</Notice>}
        {sum?.paymentMode === 'unavailable' && <Notice tone="bad">Online payments are not available right now.</Notice>}
      </div>
      <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-28"><h2 className="text-xl">Order summary</h2>
        {sum && <><div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tnum">{money(sum.subtotal)}</span></div>{sum.discount > 0 && <div className="flex justify-between text-ok"><span>Discount</span><span className="tnum">−{money(sum.discount)}</span></div>}<div className="flex justify-between"><span className="text-muted">Delivery</span><span className="tnum">{sum.shipping ? money(sum.shipping) : 'Free'}</span></div><div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><span>Total</span><span className="tnum">{money(sum.total)}</span></div></>}
        <button className="btn-primary w-full" disabled={busy || !addressId || !sum || sum.problems.length > 0 || sum.paymentMode === 'unavailable' || (sum.notRecommended?.length > 0 && !ack)} onClick={place}>{busy ? 'Processing…' : sum?.paymentMode === 'demo' ? 'Place order (demo)' : 'Pay securely'}</button>
        <p className="text-xs text-muted">Prices, stock and totals are re-checked on our server when you place the order.</p></aside>
    </div>
  );
}
export default function Page() { return <Guard role="BUYER"><Checkout /></Guard>; }
