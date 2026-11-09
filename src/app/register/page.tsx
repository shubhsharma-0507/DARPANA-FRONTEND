'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Field, Notice } from '@/components/ui';
import { api, errMsg, fieldErr } from '@/lib/api';
import { homeFor, useAuth } from '@/lib/auth';
import { GoogleButton } from '@/components/GoogleButton';

function Form() {
  const router = useRouter(); const sp = useSearchParams(); const { reload } = useAuth();
  const [type, setType] = useState<'BUYER' | 'SHOP_OWNER'>(sp.get('type') === 'seller' ? 'SHOP_OWNER' : 'BUYER');
  const [f, setF] = useState({ name: '', email: '', password: '', shopName: '' }); const [adult, setAdult] = useState(false);
  const [err, setErr] = useState<unknown>(null); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try {
      const r = await api('/auth/register', { body: { name: f.name, email: f.email, password: f.password, accountType: type, adult18Confirmed: adult || undefined, shopName: type === 'SHOP_OWNER' ? f.shopName : undefined } });
      await reload(); router.replace(type === 'SHOP_OWNER' ? '/seller/apply' : homeFor(r.user.role));
    } catch (e) { setErr(e); } finally { setBusy(false); }
  }
  return (
    <div className="container flex justify-center py-12"><div className="card w-full max-w-md p-6 md:p-8">
      <h1 className="text-3xl md:text-3xl">Create your account</h1>
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-full bg-plum-soft p-1" role="tablist" aria-label="Account type">
        {(['BUYER', 'SHOP_OWNER'] as const).map((t) => <button key={t} role="tab" aria-selected={type === t} onClick={() => setType(t)} className={`min-h-[40px] rounded-full text-sm font-medium ${type === t ? 'bg-white text-plum shadow-card' : 'text-muted'}`}>{t === 'BUYER' ? 'Buyer' : 'Seller'}</button>)}
      </div>
      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        {err ? <Notice tone="bad">{errMsg(err)}</Notice> : null}
        <Field label="Full name" error={fieldErr(err, 'name')}><input className="input" autoComplete="name" required value={f.name} onChange={set('name')} /></Field>
        {type === 'SHOP_OWNER' && <Field label="Shop name" error={fieldErr(err, 'shopName')}><input className="input" required value={f.shopName} onChange={set('shopName')} /></Field>}
        <Field label="Email" error={fieldErr(err, 'email')}><input className="input" type="email" autoComplete="email" required value={f.email} onChange={set('email')} /></Field>
        <Field label="Password" hint="At least 8 characters with a letter and a number" error={fieldErr(err, 'password')}><input className="input" type="password" autoComplete="new-password" required value={f.password} onChange={set('password')} /></Field>
        <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 h-5 w-5 accent-[#BB1042]" checked={adult} onChange={(e) => setAdult(e.target.checked)} />I confirm that I am 18 years or older.</label>
        {fieldErr(err, 'adult18Confirmed') && <p role="alert" className="text-sm text-bad">{fieldErr(err, 'adult18Confirmed')}</p>}
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating…' : type === 'BUYER' ? 'Create account' : 'Create seller account'}</button>
        {type === 'SHOP_OWNER' && <Notice>Your seller request goes straight to the Darpana admin. You can start selling once it is approved. You’ll complete your business and KYC details right after signing up.</Notice>}
      </form>
      {type === 'BUYER' && <><div className="my-5 text-center text-xs text-muted">or</div><GoogleButton adult18={adult} onDone={async (u) => { await reload(); router.replace(homeFor(u.role)); }} /></>}
      <p className="mt-6 text-center text-sm">Already registered? <Link href="/login" className="text-plum underline">Sign in</Link></p>
    </div></div>
  );
}
export default function Page() { return <Suspense><Form /></Suspense>; }
