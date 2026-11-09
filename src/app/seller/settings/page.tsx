'use client';
import { useEffect, useState } from 'react';
import { ErrorBox, Field, PageLoading, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Settings() {
  const { data, loading, error, reload } = useFetch<any>('/seller/profile'); const toast = useToast();
  const [f, setF] = useState({ description: '', returnPolicy: '', shippingPolicy: '' });
  useEffect(() => { if (data?.profile) setF({ description: data.profile.description ?? '', returnPolicy: data.profile.returnPolicy ?? '', shippingPolicy: data.profile.shippingPolicy ?? '' }); }, [data]);
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function save(e: React.FormEvent) { e.preventDefault(); try { await api('/seller/profile', { method: 'PATCH', body: Object.fromEntries(Object.entries(f).filter(([, v]) => v)) }); toast('Shop settings saved'); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <form onSubmit={save} className="space-y-4"><h1 className="text-3xl md:text-4xl">Shop settings</h1><p className="text-muted">Shop name: <strong>{data.profile.shopName}</strong></p>
    {(['description', 'returnPolicy', 'shippingPolicy'] as const).map((k) => <Field key={k} label={{ description: 'About your shop', returnPolicy: 'Return policy', shippingPolicy: 'Shipping policy' }[k]}><textarea className="input min-h-24" value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} /></Field>)}<button className="btn-primary">Save</button></form>;
}
