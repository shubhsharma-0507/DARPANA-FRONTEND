'use client';
import { Empty, ErrorBox, PageLoading, Stars, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Reviews() {
  const { data, loading, error, reload } = useFetch<any>('/admin/reviews'); const toast = useToast();
  async function mod(id: string, moderation: string) { const reason = prompt('Reason (for the audit log)'); if (!reason) return; try { await api(`/admin/reviews/${id}/moderate`, { body: { moderation, reason } }); toast('Done'); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Review moderation</h1>{!data.items.length && <Empty title="Nothing reported" />}{data.items.map((r: any) => <div key={r._id} className="card space-y-2 p-4"><Stars value={r.rating} />{r.title && <p className="font-medium">{r.title}</p>}<p className="text-sm text-muted">{r.text}</p><p className="text-xs text-bad">{r.reports?.map((x: any) => x.reason).join(' · ')}</p><div className="flex gap-2"><button className="btn-ghost btn-sm" onClick={() => mod(r._id, 'approved')}>Keep</button><button className="btn-ghost btn-sm text-bad" onClick={() => mod(r._id, 'rejected')}>Remove</button></div></div>)}</div>;
}
