'use client';
import { useState } from 'react';
import { Empty, ErrorBox, Modal, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Returns() {
  const { data, loading, error, reload } = useFetch<any>('/admin/returns'); const toast = useToast(); const [r, setR] = useState<any>(null); const [note, setNote] = useState('');
  async function decide(decision: string, refund: boolean) { try { await api(`/admin/returns/${r._id}/decision`, { body: { decision, note, refund } }); toast('Saved'); setR(null); setNote(''); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Returns</h1>{!data.items.length && <Empty title="No returns" />}{data.items.map((x: any) => <div key={x._id} className="card space-y-1 p-4"><div className="flex justify-between"><p className="font-medium">{x.reason.replace(/_/g, ' ')}</p><StatusBadge s={x.status} /></div>{x.comment && <p className="text-sm text-muted">Buyer: {x.comment}</p>}{x.sellerResponse && <p className="text-sm">Seller: {x.sellerResponse}</p>}{!['refunded', 'closed', 'rejected'].includes(x.status) && <button className="btn-plum btn-sm mt-2" onClick={() => setR(x)}>Decide</button>}</div>)}
    <Modal open={!!r} onClose={() => setR(null)} title="Return decision"><div className="space-y-3"><textarea className="input min-h-24" placeholder="Decision note (shared with buyer and seller)" value={note} onChange={(e) => setNote(e.target.value)} aria-label="Decision note" /><div className="flex flex-wrap gap-2"><button className="btn-primary btn-sm" disabled={note.length < 3} onClick={() => decide('approved', true)}>Approve & refund</button><button className="btn-ghost btn-sm" disabled={note.length < 3} onClick={() => decide('approved', false)}>Approve (no refund yet)</button><button className="btn-ghost btn-sm" disabled={note.length < 3} onClick={() => decide('rejected', false)}>Reject</button></div></div></Modal></div>;
}
