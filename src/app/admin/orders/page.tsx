'use client';
import { ErrorBox, PageLoading, StatusBadge } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Orders() {
  const { data, loading, error, reload } = useFetch<any>('/admin/orders');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Orders</h1><div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="p-3">Order</th><th>Buyer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>{data.items.map((o: any) => <tr key={o._id} className="border-b border-line last:border-0"><td className="p-3 font-medium">{o.orderNumber}</td><td>{o.buyerId?.email}</td><td className="tnum">{money(o.total)}</td><td><StatusBadge s={o.paymentStatus} /></td><td><StatusBadge s={o.status} /></td><td>{new Date(o.createdAt).toLocaleDateString('en-IN')}</td></tr>)}{!data.items.length && <tr><td className="p-4 text-muted" colSpan={6}>No orders yet.</td></tr>}</tbody></table></div></div>;
}
