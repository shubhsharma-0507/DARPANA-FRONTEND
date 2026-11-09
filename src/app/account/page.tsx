'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ErrorBox, Field, PageLoading, useToast } from '@/components/ui';
import { api, errMsg, fieldErr } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Profile() {
  const { data, loading, error, reload } = useFetch<any>('/me/profile'); const sk = useFetch<any>('/me/skin-profile'); const toast = useToast();
  const [f, setF] = useState({ name: '', phone: '' }); const [err, setErr] = useState<unknown>(null);
  useEffect(() => { if (data) setF({ name: data.user.name, phone: data.user.phone ?? '' }); }, [data]);
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function save(e: React.FormEvent) { e.preventDefault(); setErr(null); try { await api('/me/profile', { method: 'PATCH', body: { name: f.name, ...(f.phone ? { phone: f.phone } : {}) } }); toast('Profile saved'); } catch (e) { setErr(e); toast(errMsg(e), 'bad'); } }
  return <div className="space-y-6"><h1 className="text-3xl md:text-4xl">Hello, {data.user.name.split(' ')[0]}</h1>
    <div className="card flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="font-medium">Skin profile</p><p className="text-sm text-muted">{sk.data?.exists ? `${sk.data.completion}% complete` : 'Not started yet'}</p></div><Link href="/account/skin-profile" className="btn-primary btn-sm">{sk.data?.exists ? 'Edit profile' : 'Start the quiz'}</Link></div>
    <form onSubmit={save} className="card grid gap-4 p-5 sm:grid-cols-2"><h2 className="text-xl sm:col-span-2">Personal information</h2>
      <Field label="Full name" error={fieldErr(err, 'name')}><input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
      <Field label="Email"><input className="input bg-ivory" value={data.user.email} disabled /></Field>
      <Field label="Mobile number" error={fieldErr(err, 'phone')}><input className="input" inputMode="numeric" maxLength={10} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
      <div className="sm:col-span-2"><button className="btn-primary">Save changes</button></div></form></div>;
}
