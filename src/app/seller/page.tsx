'use client';
import Link from 'next/link';
import { ErrorBox, PageLoading, StatusBadge } from '@/components/ui';
import { money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

const Stat = ({ label, value, href }: { label: string; value: React.ReactNode; href?: string }) => { const c = <div className="card p-5"><p className="text-sm text-muted">{label}</p><p className="tnum mt-1 font-serif text-3xl text-plum">{value}</p></div>; return href ? <Link href={href}>{c}</Link> : c; };
export default function Overview() {
  const { data, loading, error, reload } = useFetch<any>('/seller/dashboard');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-5"><div className="flex items-center gap-3"><h1 className="text-3xl md:text-4xl">Overview</h1><StatusBadge s={data.status} /></div>
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3"><Stat label="Gross sales" value={money(data.gross)} /><Stat label="Commission" value={money(data.commission)} /><Stat label="Payable to you" value={money(data.payable)} href="/seller/earnings" />
      <Stat label="Orders" value={data.orders} href="/seller/orders" /><Stat label="To fulfil" value={data.pendingFulfilment} href="/seller/orders" /><Stat label="Low stock" value={data.lowStock} href="/seller/inventory" /><Stat label="Return requests" value={data.returns} href="/seller/returns" /></div></div>;
}
