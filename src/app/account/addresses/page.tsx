'use client';
import { useState } from 'react';
import { AddressForm } from '@/components/AddressForm';
import { Badge, Empty, ErrorBox, PageLoading, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Addresses() {
  const { data, loading, error, reload } = useFetch<any>('/me/addresses'); const [edit, setEdit] = useState<any>(null); const [add, setAdd] = useState(false); const toast = useToast();
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function del(id: string) { try { await api(`/me/addresses/${id}`, { method: 'DELETE' }); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-3xl md:text-4xl">Addresses</h1><button className="btn-primary btn-sm" onClick={() => { setAdd(!add); setEdit(null); }}>{add ? 'Cancel' : 'Add address'}</button></div>
    {(add || edit) && <div className="card p-5"><AddressForm key={edit?._id ?? 'new'} initial={edit} onSaved={() => { setAdd(false); setEdit(null); reload(); }} /></div>}
    {!data.items.length && !add && <Empty title="No saved addresses" hint="Add one to speed up checkout." />}
    <div className="grid gap-3 sm:grid-cols-2">{data.items.map((a: any) => <div key={a._id} className="card space-y-1 p-4 text-sm"><div className="flex justify-between"><strong>{a.fullName}</strong>{a.isDefault && <Badge tone="plum">Default</Badge>}</div><p>{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p><p>{a.city}, {a.state} <span className="tnum">{a.pincode}</span></p><p className="tnum text-muted">{a.phone}</p><div className="flex gap-2 pt-2"><button className="btn-ghost btn-sm" onClick={() => { setEdit(a); setAdd(false); }}>Edit</button><button className="btn-ghost btn-sm" onClick={() => del(a._id)}>Delete</button></div></div>)}</div></div>;
}
