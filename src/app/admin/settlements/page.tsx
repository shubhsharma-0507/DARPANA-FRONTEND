'use client';
import { ErrorBox, Notice, PageLoading } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Settlements() {
  const { data, loading, error, reload } = useFetch<any>('/admin/settlements');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Settlements</h1><Notice tone="warn">{data.note}</Notice><div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="p-3">Seller</th><th>Orders</th><th>Gross</th><th>Commission</th><th>Payable</th></tr></thead><tbody>{data.items.map((s: any) => <tr key={s._id} className="border-b border-line last:border-0"><td className="p-3 font-medium">{s.shopName}</td><td className="tnum">{s.orders}</td><td className="tnum">{money(s.gross)}</td><td className="tnum">{money(s.commission)}</td><td className="tnum font-medium">{money(s.payable)}</td></tr>)}{!data.items.length && <tr><td colSpan={5} className="p-4 text-muted">Delivered orders will appear here.</td></tr>}</tbody></table></div></div>;
}
