'use client';
import { useState } from 'react';
import { Badge, Empty, ErrorBox, Field, Modal, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Inventory() {
  const { data, loading, error, reload } = useFetch<any>('/seller/listings'); const toast = useToast();
  const [adj, setAdj] = useState<any>(null); const [delta, setDelta] = useState(''); const [reason, setReason] = useState('Restock'); const [hist, setHist] = useState<any[] | null>(null);
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function save() { try { await api(`/seller/listings/${adj.id}/stock`, { body: { delta: Number(delta), reason } }); toast('Stock updated'); setAdj(null); setDelta(''); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Inventory</h1>{!data.items.length && <Empty title="No listings yet" hint="Listings appear here when you add products." />}
    <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="p-3">Product</th><th>SKU</th><th>Price</th><th>Available</th><th>Reserved</th><th>Status</th><th /></tr></thead>
      <tbody>{data.items.map((l: any) => <tr key={l.id} className="border-b border-line last:border-0"><td className="p-3">{l.product}<span className="block text-xs text-muted">{l.variant}</span></td><td>{l.sku}</td><td className="tnum">{money(l.price)}</td><td className="tnum">{l.available} {l.low && l.status === 'approved' && <Badge tone="warn">Low</Badge>}</td><td className="tnum">{l.reserved}</td><td><StatusBadge s={l.status} /></td>
        <td className="space-x-2 p-3 text-right"><button className="btn-ghost btn-sm" onClick={() => setAdj(l)}>Adjust</button><button className="btn-ghost btn-sm" onClick={async () => setHist((await api(`/seller/listings/${l.id}/movements`)).items)}>History</button></td></tr>)}</tbody></table></div>
    <Modal open={!!adj} onClose={() => setAdj(null)} title="Adjust stock"><div className="space-y-3"><Field label="Change (use − to remove)" hint={`Currently ${adj?.available} available`}><input className="input tnum" inputMode="numeric" value={delta} onChange={(e) => setDelta(e.target.value)} /></Field><Field label="Reason"><input className="input" value={reason} onChange={(e) => setReason(e.target.value)} /></Field><button className="btn-primary" disabled={!delta || Number.isNaN(Number(delta))} onClick={save}>Save</button></div></Modal>
    <Modal open={!!hist} onClose={() => setHist(null)} title="Stock history"><ul className="divide-y divide-line text-sm">{hist?.map((m) => <li key={m._id} className="flex justify-between py-2"><span>{m.reason}</span><span className="tnum">{m.delta > 0 ? '+' : ''}{m.delta}</span></li>)}{hist?.length === 0 && <li className="py-2 text-muted">No movements yet.</li>}</ul></Modal></div>;
}
