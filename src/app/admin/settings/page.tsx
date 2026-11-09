'use client';
import { useEffect, useState } from 'react';
import { ErrorBox, Field, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Settings() {
  const { data, loading, error, reload } = useFetch<any>('/admin/settings'); const toast = useToast();
  const [v, setV] = useState<any>({}); const [reason, setReason] = useState('');
  useEffect(() => { if (data) setV({ commissionPercent: String(data.commissionPercent), returnWindowDays: String(data.returnWindowDays), payoutHoldDays: String(data.payoutHoldDays), flat: String(data.shipping.flatPerSeller), free: String(data.shipping.freeAbove), coupons: JSON.stringify(data.coupons, null, 1) }); }, [data]);
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function put(key: string, value: unknown) { try { await api(`/admin/settings/${key}`, { method: 'PUT', body: { value, reason } }); toast('Saved'); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  const row = (label: string, k: string, key: string) => <div className="flex items-end gap-2"><div className="flex-1"><Field label={label}><input className="input tnum" inputMode="decimal" value={v[k] ?? ''} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></Field></div><button className="btn-ghost" disabled={reason.length < 3} onClick={() => put(key, Number(v[k]))}>Save</button></div>;
  return <div className="space-y-5"><h1 className="text-3xl md:text-4xl">Settings</h1><Notice>Every change is audit-logged with the reason below.</Notice><Field label="Reason for change (required)"><input className="input" value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
    <div className="card space-y-3 p-5">{row('Default commission (%)', 'commissionPercent', 'commissionPercent')}{row('Return window (days)', 'returnWindowDays', 'returnWindowDays')}{row('Payout hold (days)', 'payoutHoldDays', 'payoutHoldDays')}
      <div className="flex items-end gap-2"><div className="grid flex-1 grid-cols-2 gap-2"><Field label="Delivery fee per seller (₹)"><input className="input tnum" value={v.flat ?? ''} onChange={(e) => setV({ ...v, flat: e.target.value })} /></Field><Field label="Free above (₹)"><input className="input tnum" value={v.free ?? ''} onChange={(e) => setV({ ...v, free: e.target.value })} /></Field></div><button className="btn-ghost" disabled={reason.length < 3} onClick={() => put('shipping', { flatPerSeller: Number(v.flat), freeAbove: Number(v.free) })}>Save</button></div>
      <Field label="Coupons (JSON)"><textarea className="input min-h-28 font-mono text-sm" value={v.coupons ?? ''} onChange={(e) => setV({ ...v, coupons: e.target.value })} /></Field><button className="btn-ghost" disabled={reason.length < 3} onClick={() => { try { put('coupons', JSON.parse(v.coupons)); } catch { toast('Coupons must be valid JSON', 'bad'); } }}>Save coupons</button></div></div>;
}
