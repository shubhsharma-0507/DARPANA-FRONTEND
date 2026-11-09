'use client';
import { ErrorBox, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/hooks';

export default function Security() {
  const { logout } = useAuth(); const toast = useToast(); const { data, loading, error, reload } = useFetch<any>('/me/sessions');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-6"><h1 className="text-3xl md:text-4xl">Security & privacy</h1>
    <section className="card space-y-3 p-5"><h2 className="text-xl">Signed-in devices</h2><ul className="divide-y divide-line text-sm">{data.items.map((s: any) => <li key={s._id} className="flex justify-between gap-3 py-2"><span className="min-w-0 truncate">{s.userAgent ?? 'Unknown device'}{s.current && <strong> (this device)</strong>}</span><span className="text-muted">{new Date(s.createdAt).toLocaleDateString('en-IN')}</span></li>)}</ul>
      <button className="btn-ghost btn-sm" onClick={async () => { await api('/auth/logout-all', { body: {} }); window.location.href = '/login'; }}>Sign out of all devices</button></section>
    <section className="card space-y-3 p-5"><h2 className="text-xl">Delete my account</h2><Notice tone="warn">This signs you out everywhere and erases your skin profile immediately. Order records are kept as required for tax and legal reasons.</Notice>
      <button className="btn-ghost btn-sm text-bad" onClick={async () => { if (!confirm('Delete your account? This cannot be undone.')) return; try { await api('/me/delete-request', { body: {} }); logout(); } catch (e) { toast(errMsg(e), 'bad'); } }}>Request account deletion</button></section></div>;
}
