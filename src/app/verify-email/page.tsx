'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Notice } from '@/components/ui';
import { api, errMsg } from '@/lib/api';

function V() {
  const token = useSearchParams().get('token'); const [s, setS] = useState<'busy' | 'ok' | string>('busy');
  useEffect(() => { if (!token) { setS('This verification link is incomplete.'); return; } api('/auth/verify-email', { body: { token } }).then(() => setS('ok')).catch((e) => setS(errMsg(e))); }, [token]);
  return <div className="container flex justify-center py-16"><div className="card w-full max-w-md space-y-4 p-8 text-center"><h1 className="text-3xl md:text-3xl">Email verification</h1>
    {s === 'busy' ? <p>Verifying…</p> : s === 'ok' ? <><Notice tone="ok">Your email is verified.</Notice><Link className="btn-primary" href="/login">Continue</Link></> : <Notice tone="bad">{s}</Notice>}</div></div>;
}
export default function Page() { return <Suspense><V /></Suspense>; }
