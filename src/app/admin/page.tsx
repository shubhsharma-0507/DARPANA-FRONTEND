'use client';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { ErrorBox, Notice, PageLoading } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { api, money } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

const Stat = ({ label, value, href, alert }: { label: string; value: React.ReactNode; href?: string; alert?: boolean }) => { const c = <div className={`card p-5 ${alert ? 'border-coral/50 bg-blush-soft' : ''}`}><p className="text-sm text-muted">{label}</p><p className="tnum mt-1 font-serif text-3xl text-plum">{value}</p></div>; return href ? <Link href={href}>{c}</Link> : c; };
export default function Overview() {
  const { me } = useAuth(); const { data, loading, error, reload } = useFetch<any>('/admin/dashboard'); const notes = useFetch<any>('/admin/notifications');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-5"><h1 className="text-3xl md:text-4xl">Marketplace overview</h1>
    {!me?.mfaEnabled && <Notice tone="warn">Two-step verification is required for admin access in production. Set it up via <code>POST /api/v1/auth/mfa/setup</code> and <code>/mfa/verify</code>.</Notice>}
    {notes.data && notes.data.items.length > 0 && <section className="card p-5" aria-label="Notifications"><div className="mb-2 flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl"><Bell size={20} aria-hidden />New requests {notes.data.unread > 0 && <span className="tnum rounded-full bg-coral px-2 py-0.5 text-xs text-white">{notes.data.unread} new</span>}</h2>{notes.data.unread > 0 && <button className="text-sm text-coral underline" onClick={async () => { await api('/admin/notifications/read', { body: {} }); notes.reload(); }}>Mark all read</button>}</div>
      <ul className="divide-y divide-line">{notes.data.items.slice(0, 6).map((n: any) => <li key={n._id} className="flex items-start justify-between gap-3 py-2 text-sm"><span><strong className={n.readAt ? 'font-medium' : 'font-semibold'}>{n.title}</strong><span className="block text-muted">{n.body}</span><span className="text-xs text-muted">{new Date(n.createdAt).toLocaleString('en-IN')}</span></span>{n.link && <Link href={n.link} className="btn-ghost btn-sm shrink-0">Open</Link>}</li>)}</ul></section>}
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4"><Stat label="GMV" value={money(data.gmv)} /><Stat label="Paid orders" value={data.paidOrders} href="/admin/orders" /><Stat label="Commission earned" value={money(data.commissionEarned)} /><Stat label="Payout liability" value={money(data.payoutLiability)} href="/admin/settlements" />
      <Stat label="Active buyers" value={data.activeBuyers} href="/admin/users" /><Stat label="Active sellers" value={data.activeSellers} href="/admin/sellers" /><Stat label="Seller requests pending" value={data.pendingSellers} href="/admin/sellers" alert={data.pendingSellers > 0} /><Stat label="Products awaiting review" value={data.pendingProducts + data.pendingListings} href="/admin/products" alert={data.pendingProducts > 0} />
      <Stat label="Open returns" value={data.openReturns} href="/admin/returns" alert={data.openReturns > 0} /><Stat label="Refunded orders" value={data.refunds} /><Stat label="Reported reviews" value={data.reportedReviews} href="/admin/reviews" alert={data.reportedReviews > 0} /></div></div>;
}
