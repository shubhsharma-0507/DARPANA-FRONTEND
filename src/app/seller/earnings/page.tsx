'use client';
import { ErrorBox, Notice, PageLoading } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Earnings() {
  const { data, loading, error, reload } = useFetch<any>('/seller/earnings');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Earnings</h1>
    <div className="grid gap-3 sm:grid-cols-2"><div className="card p-5"><p className="text-sm text-muted">Ready to pay out</p><p className="tnum font-serif text-3xl text-plum">{money(data.payableNow)}</p></div><div className="card p-5"><p className="text-sm text-muted">On hold ({data.holdDays}-day return window)</p><p className="tnum font-serif text-3xl text-plum">{money(data.onHold)}</p></div></div>
    <Notice>Payouts are currently settled by the Darpana team using the ledger below.</Notice>
    <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="p-3">Gross</th><th>Commission</th><th>Payable</th><th>Eligible from</th></tr></thead><tbody>{data.rows.map((r: any) => <tr key={r.id} className="border-b border-line last:border-0"><td className="tnum p-3">{money(r.gross)}</td><td className="tnum">{money(r.commission)} ({r.commissionPercent}%)</td><td className="tnum font-medium">{money(r.payable)}</td><td>{r.eligibleOn ? new Date(r.eligibleOn).toLocaleDateString('en-IN') : '—'}</td></tr>)}{!data.rows.length && <tr><td className="p-4 text-muted" colSpan={4}>Delivered orders will appear here.</td></tr>}</tbody></table></div></div>;
}
