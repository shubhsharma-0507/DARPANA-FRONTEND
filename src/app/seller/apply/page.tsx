'use client';
import { useEffect, useState } from 'react';
import { Field, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg, fieldErr } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { uploadImage } from '@/lib/upload';
import { useFetch } from '@/lib/hooks';

const DOCS = [['pan', 'PAN card'], ['gst', 'GST certificate'], ['address_proof', 'Address proof'], ['identity', 'Identity proof'], ['cancelled_cheque', 'Cancelled cheque']];
export default function Apply() {
  const { reload: reloadAuth, seller } = useAuth(); const toast = useToast(); const { data, loading } = useFetch<any>('/seller/profile');
  const [f, setF] = useState<any>({ shopName: '', legalName: '', contactEmail: '', contactPhone: '', line1: '', city: '', state: '', pincode: '', gstin: '', pan: '', holder: '', accountLast4: '', ifsc: '', description: '', returnPolicy: '', shippingPolicy: '' });
  const [docs, setDocs] = useState<{ type: string; publicId: string }[]>([]); const [err, setErr] = useState<unknown>(null); const [busy, setBusy] = useState(false); const [consent, setConsent] = useState(false);
  useEffect(() => { const p = data?.profile; if (p) setF((x: any) => ({ ...x, shopName: p.shopName ?? '', legalName: p.legalName ?? '', contactEmail: p.contactEmail ?? '', contactPhone: p.contactPhone ?? '', line1: p.address?.line1 ?? '', city: p.address?.city ?? '', state: p.address?.state ?? '', pincode: p.address?.pincode ?? '', gstin: p.gstin ?? '', pan: p.pan ?? '', holder: p.bankRef?.holder ?? '', accountLast4: p.bankRef?.last4 ?? '', ifsc: p.bankRef?.ifsc ?? '', description: p.description ?? '' })); }, [data]);
  if (loading) return <PageLoading />;
  const locked = ['under_review', 'approved'].includes(data?.profile?.status);
  const s = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  async function up(type: string, file?: File) { if (!file) return; try { const r = await uploadImage(file, 'kyc'); setDocs((d) => [...d.filter((x) => x.type !== type), { type, publicId: r.publicId }]); toast('Document uploaded securely'); } catch (e) { toast(errMsg(e), 'bad'); } }
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try { await api('/seller/apply', { body: { shopName: f.shopName, legalName: f.legalName, contactEmail: f.contactEmail, contactPhone: f.contactPhone, address: { line1: f.line1, city: f.city, state: f.state, pincode: f.pincode }, gstin: f.gstin || '', pan: f.pan.toUpperCase(), bank: { holder: f.holder, accountLast4: f.accountLast4, ifsc: f.ifsc.toUpperCase() }, kycDocs: docs, description: f.description || undefined, returnPolicy: f.returnPolicy || undefined, shippingPolicy: f.shippingPolicy || undefined } }); toast('Application submitted'); await reloadAuth(); }
    catch (e) { setErr(e); } finally { setBusy(false); }
  }
  const I = (k: string, label: string, extra: any = {}) => <Field label={label} error={fieldErr(err, k) ?? (k === 'pincode' ? fieldErr(err, 'address') : undefined)}><input className="input" value={f[k]} onChange={s(k)} disabled={locked} {...extra} /></Field>;
  return <form onSubmit={submit} className="space-y-6"><h1 className="text-3xl md:text-4xl">Seller application</h1>
    {locked && <Notice>Status: <strong>{seller?.status.replace('_', ' ')}</strong>. You can’t edit while it’s being reviewed.</Notice>}{err ? <Notice tone="bad">{errMsg(err)}</Notice> : null}
    <section className="card grid gap-4 p-5 sm:grid-cols-2"><h2 className="text-xl sm:col-span-2">Business details</h2>{I('shopName', 'Shop name')}{I('legalName', 'Legal business name')}{I('contactEmail', 'Contact email', { type: 'email' })}{I('contactPhone', 'Contact mobile', { inputMode: 'numeric', maxLength: 10 })}
      <div className="sm:col-span-2">{I('line1', 'Business address')}</div>{I('city', 'City')}{I('state', 'State')}{I('pincode', 'Pincode', { inputMode: 'numeric', maxLength: 6 })}{I('gstin', 'GSTIN (if applicable)', { placeholder: '22AAAAA0000A1Z5' })}{I('pan', 'PAN', { placeholder: 'ABCDE1234F' })}</section>
    <section className="card grid gap-4 p-5 sm:grid-cols-3"><h2 className="text-xl sm:col-span-3">Bank details for payouts</h2>{I('holder', 'Account holder')}{I('accountLast4', 'Last 4 digits of account', { maxLength: 4, inputMode: 'numeric' })}{I('ifsc', 'IFSC')}<p className="text-xs text-muted sm:col-span-3">We store only the last 4 digits. Full details are collected through our payment partner at payout setup.</p></section>
    <section className="card space-y-3 p-5"><h2 className="text-xl">Verification documents</h2><Notice>These are used only to verify your business. They are stored privately and never shown to buyers or other sellers.</Notice>
      <div className="grid gap-3 sm:grid-cols-2">{DOCS.map(([t, l]) => <div key={t} className="rounded-xl border border-line p-3"><p className="text-sm font-medium">{l} {docs.find((d) => d.type === t) && <span className="text-ok">✓ uploaded</span>}</p><input type="file" accept="image/*,application/pdf" disabled={locked} onChange={(e) => up(t, e.target.files?.[0])} aria-label={`Upload ${l}`} className="mt-2 text-sm" /></div>)}</div>{fieldErr(err, 'kycDocs') && <p className="text-sm text-bad">Upload at least one document.</p>}</section>
    <section className="card grid gap-4 p-5"><h2 className="text-xl">Shop policies (optional)</h2><Field label="About your shop"><textarea className="input min-h-20" value={f.description} onChange={s('description')} disabled={locked} /></Field><Field label="Return policy"><textarea className="input min-h-20" value={f.returnPolicy} onChange={s('returnPolicy')} disabled={locked} /></Field></section>
    {!locked && <><label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#BB1042]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />I confirm the details are accurate and agree to Darpana reviewing my documents.</label><button className="btn-primary" disabled={busy || !consent || !docs.length}>{busy ? 'Submitting…' : 'Send details to admin'}</button></>}</form>;
}
