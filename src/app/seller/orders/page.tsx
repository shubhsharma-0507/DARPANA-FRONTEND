'use client';
import { useState } from 'react';
import { Empty, ErrorBox, Field, Modal, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

const NEXT: Record<string, [string, string][]> = { pending_acceptance: [['accepted', 'Accept'], ['rejected', 'Reject & refund']], accepted: [['packing', 'Start packing']], packing: [['ready_to_ship', 'Mark ready']], ready_to_ship: [['shipped', 'Add tracking & ship']], shipped: [['delivered', 'Mark delivered']] };
export default function Orders() {
  const { data, loading, error, reload } = useFetch<any>('/seller/orders'); const toast = useToast(); const [ship, setShip] = useState<any>(null); const [courier, setCourier] = useState(''); const [tid, setTid] = useState('');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function move(id: string, status: string, extra: any = {}) { if (status === 'rejected' && !confirm('Reject this order? The buyer is refunded and stock returns.')) return; try { await api(`/seller/orders/${id}/status`, { body: { status, ...extra } }); toast('Order updated'); setShip(null); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Orders</h1>{!data.items.length && <Empty title="No paid orders yet" />}
    {data.items.map((o: any) => <div key={o.id} className="card space-y-3 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium">{o.orderNumber}</p><StatusBadge s={o.status} /></div>
      <ul className="text-sm">{o.items.map((i: any) => <li key={i._id} className="flex justify-between"><span>{i.title} · {i.variantName} × <span className="tnum">{i.qty}</span></span><span className="tnum">{money(i.lineTotal)}</span></li>)}</ul>
      <p className="text-sm text-muted">Ship to: {o.ship_to.name}, {o.ship_to.line1}, {o.ship_to.city}, {o.ship_to.state} <span className="tnum">{o.ship_to.pincode}</span> · <span className="tnum">{o.ship_to.phone}</span></p>
      <p className="text-sm">You earn <strong className="tnum">{money(o.payable)}</strong> <span className="text-muted">(after <span className="tnum">{money(o.commission)}</span> commission)</span></p>
      <div className="flex flex-wrap gap-2">{(NEXT[o.status] ?? []).map(([s, l]) => <button key={s} className={s === 'rejected' ? 'btn-ghost btn-sm' : 'btn-plum btn-sm'} onClick={() => (s === 'shipped' ? setShip(o) : move(o.id, s))}>{l}</button>)}</div></div>)}
    <Modal open={!!ship} onClose={() => setShip(null)} title="Ship order"><div className="space-y-3"><Field label="Courier"><input className="input" value={courier} onChange={(e) => setCourier(e.target.value)} /></Field><Field label="Tracking ID"><input className="input" value={tid} onChange={(e) => setTid(e.target.value)} /></Field><button className="btn-primary" disabled={!courier || !tid} onClick={() => move(ship.id, 'shipped', { courier, trackingId: tid })}>Mark as shipped</button></div></Modal></div>;
}
