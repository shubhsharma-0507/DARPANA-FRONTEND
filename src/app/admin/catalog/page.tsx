'use client';
import { useState } from 'react';
import { ErrorBox, Field, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Catalog() {
  const brands = useFetch<any>('/brands'); const cats = useFetch<any>('/categories'); const toast = useToast(); const [b, setB] = useState(''); const [c, setC] = useState('');
  async function add(path: string, name: string, done: () => void) { try { await api(path, { body: { name } }); toast('Added'); done(); } catch (e) { toast(errMsg(e), 'bad'); } }
  if (brands.loading || cats.loading) return <PageLoading />; if (brands.error) return <ErrorBox message={brands.error} onRetry={brands.reload} />;
  return <div className="grid gap-6 md:grid-cols-2"><section className="space-y-3"><h1 className="text-3xl">Brands</h1><div className="flex gap-2"><input className="input" placeholder="New brand" value={b} onChange={(e) => setB(e.target.value)} aria-label="New brand" /><button className="btn-primary" disabled={b.length < 2} onClick={() => add('/admin/brands', b, () => { setB(''); brands.reload(); })}>Add</button></div>
    <ul className="card divide-y divide-line">{brands.data?.items.map((x: any) => <li key={x._id} className="flex items-center justify-between p-3"><span>{x.name}</span><span className="flex items-center gap-2"><StatusBadge s={x.verified ? 'approved' : 'pending'} /><button className="text-sm underline" onClick={async () => { await api(`/admin/brands/${x._id}`, { method: 'PATCH', body: { verified: !x.verified } }); brands.reload(); }}>{x.verified ? 'Unverify' : 'Verify'}</button></span></li>)}</ul></section>
    <section className="space-y-3"><h2 className="text-3xl">Categories</h2><Field label="New category"><div className="flex gap-2"><input className="input" value={c} onChange={(e) => setC(e.target.value)} /><button className="btn-primary" disabled={c.length < 2} onClick={() => add('/admin/categories', c, () => { setC(''); cats.reload(); })}>Add</button></div></Field>
      <ul className="card divide-y divide-line">{cats.data?.items.map((x: any) => <li key={x._id} className="p-3">{x.name}</li>)}</ul></section></div>;
}
