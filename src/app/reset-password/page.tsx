'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Field, Notice } from '@/components/ui';
import { api, errMsg, fieldErr } from '@/lib/api';

function F() {
  const token = useSearchParams().get('token') ?? ''; const [password, setP] = useState(''); const [err, setErr] = useState<unknown>(null); const [ok, setOk] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setErr(null); try { await api('/auth/reset-password', { body: { token, password } }); setOk(true); } catch (e) { setErr(e); } }
  return <div className="container flex justify-center py-16"><div className="card w-full max-w-md p-8"><h1 className="text-3xl md:text-3xl">Choose a new password</h1>
    {ok ? <div className="mt-5 space-y-4"><Notice tone="ok">Password updated. All other sessions were signed out.</Notice><Link href="/login" className="btn-primary">Sign in</Link></div> :
      <form onSubmit={submit} className="mt-5 space-y-4">{err ? <Notice tone="bad">{errMsg(err)}</Notice> : null}
        <Field label="New password" error={fieldErr(err, 'password')} hint="At least 8 characters with a letter and a number"><input className="input" type="password" autoComplete="new-password" required value={password} onChange={(e) => setP(e.target.value)} /></Field><button className="btn-primary w-full">Update password</button></form>}</div></div>;
}
export default function Page() { return <Suspense><F /></Suspense>; }
