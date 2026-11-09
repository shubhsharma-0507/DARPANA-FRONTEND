'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Field, Notice } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { homeFor, useAuth } from '@/lib/auth';
import { GoogleButton } from '@/components/GoogleButton';

function Form() {
  const router = useRouter(); const sp = useSearchParams(); const { reload } = useAuth();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [code, setCode] = useState('');
  const [mfa, setMfa] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      const r = await api('/auth/login', { body: { email, password, mfaCode: mfa ? code : undefined } });
      if (r.mfaRequired) { setMfa(true); return; }
      await reload(); const next = sp.get('next');
      router.replace(next && next.startsWith('/') ? next : homeFor(r.user.role));
    } catch (e) { setErr(errMsg(e)); } finally { setBusy(false); }
  }
  return (
    <div className="container flex justify-center py-12"><div className="card w-full max-w-md p-6 md:p-8">
      <h1 className="text-3xl md:text-3xl">Welcome back</h1><p className="mb-6 mt-1 text-muted">Sign in to your Darpana account.</p>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {err && <Notice tone="bad">{err}</Notice>}
        <Field label="Email"><input className="input" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input className="input" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {mfa && <Field label="6-digit verification code" hint="Open your authenticator app"><input className="input tnum" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={(e) => setCode(e.target.value)} /></Field>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Signing in…' : mfa ? 'Verify and sign in' : 'Sign in'}</button>
      </form>
      <div className="my-5 text-center text-xs text-muted">or</div>
      <GoogleButton onDone={async (u) => { await reload(); router.replace(homeFor(u.role)); }} />
      <div className="mt-6 flex justify-between text-sm"><Link href="/forgot-password" className="text-plum underline">Forgot password?</Link><Link href="/register" className="text-plum underline">Create account</Link></div>
    </div></div>
  );
}
export default function Page() { return <Suspense><Form /></Suspense>; }
