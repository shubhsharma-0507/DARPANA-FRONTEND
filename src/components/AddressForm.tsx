'use client';
import { useState } from 'react';
import { Field, Notice } from './ui';
import { api, errMsg, fieldErr } from '@/lib/api';

export function AddressForm({ onSaved, initial }: { onSaved: () => void; initial?: any }) {
  const [f, setF] = useState({ fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false, ...(initial ?? {}) });
  const [err, setErr] = useState<unknown>(null); const [busy, setBusy] = useState(false);
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  async function save(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    const { _id, buyerId, createdAt, updatedAt, __v, ...body } = f as any; void buyerId; void createdAt; void updatedAt; void __v;
    if (!body.line2) delete body.line2;
    try { await api(initial?._id ? `/me/addresses/${initial._id}` : '/me/addresses', { method: initial?._id ? 'PUT' : 'POST', body }); void _id; onSaved(); } catch (e) { setErr(e); } finally { setBusy(false); }
  }
  const F = ({ k, label, ...p }: any) => <Field label={label} error={fieldErr(err, k)}><input className="input" value={(f as any)[k] ?? ''} onChange={s(k)} {...p} /></Field>;
  return (
    <form onSubmit={save} className="grid gap-3 sm:grid-cols-2" noValidate>
      {err ? <div className="sm:col-span-2"><Notice tone="bad">{errMsg(err)}</Notice></div> : null}
      <F k="fullName" label="Full name" autoComplete="name" /><F k="phone" label="Mobile number" inputMode="numeric" maxLength={10} autoComplete="tel-national" />
      <div className="sm:col-span-2"><F k="line1" label="Address line 1" autoComplete="address-line1" /></div><div className="sm:col-span-2"><F k="line2" label="Address line 2 (optional)" /></div>
      <F k="city" label="City" /><F k="state" label="State" /><F k="pincode" label="Pincode" inputMode="numeric" maxLength={6} />
      <label className="flex items-center gap-2 self-end pb-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={!!f.isDefault} onChange={(e) => setF({ ...f, isDefault: e.target.checked })} />Make default</label>
      <div className="sm:col-span-2"><button className="btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save address'}</button></div>
    </form>
  );
}
