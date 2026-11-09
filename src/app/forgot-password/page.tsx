'use client';
import { useState } from 'react';
import { Field, Notice } from '@/components/ui';
import { api, errMsg } from '@/lib/api';

export default function Page() {
  const [email, setEmail] = useState(''); const [done, setDone] = useState(''); const [err, setErr] = useState(''); const [devToken, setDevToken] = useState('');
  async function submit(e: React.FormEvent) { e.preventDefault(); setErr(''); try { const r = await api('/auth/forgot-password', { body: { email } }); setDone(r.message); setDevToken(r.devResetToken ?? ''); } catch (e) { setErr(errMsg(e)); } }
  return <div className="container flex justify-center py-16"><div className="card w-full max-w-md p-8"><h1 className="text-3xl md:text-3xl">Reset your password</h1>
    <form onSubmit={submit} className="mt-5 space-y-4">{err && <Notice tone="bad">{err}</Notice>}{done && <Notice tone="ok">{done}</Notice>}
      {devToken && <p className="break-all text-xs text-muted">Dev only: <a className="underline" href={`/reset-password?token=${devToken}`}>open reset link</a></p>}
      <Field label="Email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field><button className="btn-primary w-full">Send reset link</button></form></div></div>;
}
