'use client';
import { useState } from 'react';
import { Empty, ErrorBox, Modal, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Returns() {
  const { data, loading, error, reload } = useFetch<any>('/seller/returns'); const toast = useToast(); const [r, setR] = useState<any>(null); const [c, setC] = useState('');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function send() { try { await api(`/seller/returns/${r._id}/respond`, { body: { comment: c } }); toast('Response sent'); setR(null); setC(''); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Returns</h1>{!data.items.length && <Empty title="No return requests" />}
    {data.items.map((x: any) => <div key={x._id} className="card space-y-2 p-4"><div className="flex justify-between"><p className="font-medium">{x.reason.replace(/_/g, ' ')}</p><StatusBadge s={x.status} /></div>{x.comment && <p className="text-sm text-muted">Buyer: {x.comment}</p>}{x.adminNote && <p className="text-sm">Darpana decision: {x.adminNote}</p>}<button className="btn-ghost btn-sm" onClick={() => setR(x)}>Respond</button></div>)}
    <Modal open={!!r} onClose={() => setR(null)} title="Respond to return"><div className="space-y-3"><textarea className="input min-h-28" value={c} onChange={(e) => setC(e.target.value)} maxLength={1000} aria-label="Your response" /><button className="btn-primary" disabled={c.length < 3} onClick={send}>Send to Darpana</button></div></Modal></div>;
}
