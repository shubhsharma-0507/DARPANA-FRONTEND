'use client';
import Link from 'next/link';
import { Empty, ErrorBox, PageLoading, StatusBadge } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Orders() {
  const { data, loading, error, reload } = useFetch<any>('/orders');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Your orders</h1>
    {!data.items.length && <Empty title="No orders yet" action={<Link href="/products" className="btn-primary">Start shopping</Link>} />}
    {data.items.map((o: any) => <Link key={o.id} href={`/account/orders/${o.id}`} className="card flex flex-wrap items-center justify-between gap-3 p-4 hover:border-rose"><div><p className="font-medium">{o.orderNumber}</p><p className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {o.preview.map((p: any) => p.title).join(', ').slice(0, 70)}</p></div><div className="flex items-center gap-3"><StatusBadge s={o.status} /><span className="tnum font-medium">{money(o.total)}</span></div></Link>)}</div>;
}
