'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Empty, ErrorBox, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Shelf() {
  const { data, loading, error, reload } = useFetch<any>('/me/shelf'); const [q, setQ] = useState(''); const [res, setRes] = useState<any[]>([]); const toast = useToast();
  async function search() { if (q.length < 2) return; try { setRes((await api('/products', { query: { q, limit: 8 } })).items); } catch (e) { toast(errMsg(e), 'bad'); } }
  async function add(id: string) { try { await api('/me/shelf', { body: { productId: id } }); toast('Added to your shelf'); setRes([]); setQ(''); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">My Shelf</h1><Notice>Add products you use now. Skin Match then flags possible routine overlaps, like two strong actives together. It’s a prompt to check the product instructions, not advice.</Notice>
    <div className="flex gap-2"><input className="input" placeholder="Search a product to add" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} aria-label="Search products to add" /><button className="btn-ghost" onClick={search}>Search</button></div>
    {res.map((p) => <div key={p.id} className="card flex items-center justify-between p-3"><span>{p.title}</span><button className="btn-primary btn-sm" onClick={() => add(p.id)}>Add</button></div>)}
    {!data.items.length ? <Empty title="Your shelf is empty" /> : data.items.map((p: any) => <div key={p._id} className="card flex items-center justify-between p-3"><Link href={`/products/${p.slug}`}>{p.title}</Link><button className="text-sm text-muted underline" onClick={() => api(`/me/shelf/${p._id}`, { method: 'DELETE' }).then(reload)}>Remove</button></div>)}</div>;
}
