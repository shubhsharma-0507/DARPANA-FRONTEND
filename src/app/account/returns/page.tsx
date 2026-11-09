'use client';
import { Empty, ErrorBox, PageLoading, StatusBadge } from '@/components/ui';
import { useFetch } from '@/lib/hooks';

export default function Returns() {
  const { data, loading, error, reload } = useFetch<any>('/returns');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Returns & refunds</h1>{!data.items.length && <Empty title="No return requests" hint="You can request a return from a delivered order." />}
    {data.items.map((r: any) => <div key={r._id} className="card space-y-2 p-4"><div className="flex items-center justify-between"><p className="font-medium">{r.reason.replace(/_/g, ' ')}</p><StatusBadge s={r.status} /></div>{r.comment && <p className="text-sm text-muted">{r.comment}</p>}{r.sellerResponse && <p className="text-sm"><strong>Seller:</strong> {r.sellerResponse}</p>}{r.adminNote && <p className="text-sm"><strong>Darpana:</strong> {r.adminNote}</p>}</div>)}</div>;
}
