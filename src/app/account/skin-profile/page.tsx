'use client';
import { useEffect, useState } from 'react';
import { ErrorBox, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

const CONCERNS = ['acne', 'pigmentation', 'dryness', 'redness', 'dullness', 'ageing', 'pores'];
const CONDITIONS = [['eczema', 'Eczema'], ['rosacea', 'Rosacea'], ['psoriasis', 'Psoriasis'], ['active_acne', 'Active acne'], ['none', 'None'], ['prefer_not_to_say', 'Prefer not to say']];
const Chip = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={`min-h-[44px] rounded-full border px-4 text-sm capitalize ${on ? 'border-plum bg-plum-soft font-medium' : 'border-line bg-white'}`}>{children}</button>;
const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function SkinProfile() {
  const { data, loading, error, reload } = useFetch<any>('/me/skin-profile'); const toast = useToast();
  const [step, setStep] = useState(0); const [busy, setBusy] = useState(false);
  const [p, setP] = useState<any>({ skinType: '', concerns: [] as string[], sensitivity: '', ageBand: '', climate: '', preferences: {} });
  const [consent, setConsent] = useState(false);
  const [useSens, setUseSens] = useState(false); const [sConsent, setSConsent] = useState(false);
  const [s, setS] = useState<any>({ allergies: '', conditions: [] as string[], pregnant: 'prefer_not', treatments: '' });
  useEffect(() => { if (data?.exists) { setP({ ...p, ...data.profile, concerns: data.profile.concerns ?? [], preferences: data.profile.preferences ?? {} }); setConsent(true);
    if (data.sensitive) { setUseSens(true); setSConsent(true); setS({ allergies: (data.sensitive.allergies ?? []).join(', '), conditions: data.sensitive.conditions ?? [], pregnant: data.sensitive.pregnant === true ? 'yes' : data.sensitive.pregnant === false ? 'no' : 'prefer_not', treatments: (data.sensitive.treatments ?? []).join(', ') }); } }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  const steps = ['Your skin', 'Comfort', 'Preferences', 'Private details'];
  const csv = (v: string) => v.split(',').map((x) => x.trim()).filter(Boolean);
  async function save() {
    setBusy(true);
    const body: any = { consentAccepted: true };
    if (p.skinType) body.skinType = p.skinType; if (p.concerns.length) body.concerns = p.concerns; if (p.sensitivity) body.sensitivity = p.sensitivity; if (p.ageBand) body.ageBand = p.ageBand; if (p.climate) body.climate = p.climate;
    const pr = Object.fromEntries(Object.entries(p.preferences).filter(([, v]) => v === true)); if (Object.keys(pr).length) body.preferences = pr;
    if (p.undertone) body.undertone = p.undertone; if (p.depth) body.depth = p.depth;
    if (useSens && sConsent) body.sensitive = { consentAccepted: true, allergies: csv(s.allergies), conditions: s.conditions, pregnant: s.pregnant === 'yes' ? true : s.pregnant === 'no' ? false : null, treatments: csv(s.treatments) };
    try { await api('/me/skin-profile', { method: 'PUT', body }); toast('Skin profile saved'); reload(); } catch (e) { toast(errMsg(e), 'bad'); } finally { setBusy(false); }
  }
  return (
    <div className="space-y-5"><div><h1 className="text-3xl md:text-4xl">Skin profile</h1><p className="mt-1 text-muted">A few quick questions. Skip anything you like. You can edit or delete this any time.</p></div>
      <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>{steps.map((n, i) => <button key={n} onClick={() => setStep(i)} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-rose' : 'bg-line'}`} aria-label={n} />)}</div>
      <p className="text-sm text-muted">Step <span className="tnum">{step + 1}</span> of {steps.length}: {steps[step]}</p>
      <div className="card space-y-6 p-6">
        {step === 0 && <><fieldset><legend className="label">Skin type</legend><p className="mb-2 text-xs text-muted">Used to check which products are made for your skin.</p><div className="flex flex-wrap gap-2">{['oily', 'dry', 'combination', 'normal', 'not_sure'].map((v) => <Chip key={v} on={p.skinType === v} onClick={() => setP({ ...p, skinType: v })}>{v.replace('_', ' ')}</Chip>)}</div></fieldset>
          <fieldset><legend className="label">Concerns</legend><div className="flex flex-wrap gap-2">{CONCERNS.map((v) => <Chip key={v} on={p.concerns.includes(v)} onClick={() => setP({ ...p, concerns: toggle(p.concerns, v) })}>{v}</Chip>)}</div></fieldset></>}
        {step === 1 && <><fieldset><legend className="label">How sensitive is your skin?</legend><p className="mb-2 text-xs text-muted">We use this to flag possible irritants.</p><div className="flex flex-wrap gap-2">{['none', 'mild', 'high'].map((v) => <Chip key={v} on={p.sensitivity === v} onClick={() => setP({ ...p, sensitivity: v })}>{v}</Chip>)}</div></fieldset>
          <fieldset><legend className="label">Age band</legend><div className="flex flex-wrap gap-2">{['18-24', '25-34', '35-44', '45+'].map((v) => <Chip key={v} on={p.ageBand === v} onClick={() => setP({ ...p, ageBand: v })}>{v}</Chip>)}</div></fieldset>
          <fieldset><legend className="label">Climate where you live</legend><p className="mb-2 text-xs text-muted">City-level only. We never ask for your location.</p><div className="flex flex-wrap gap-2">{[['hot_humid', 'Hot & humid'], ['hot_dry', 'Hot & dry'], ['temperate', 'Mild'], ['cold', 'Cold']].map(([v, l]) => <Chip key={v} on={p.climate === v} onClick={() => setP({ ...p, climate: v })}>{l}</Chip>)}</div></fieldset></>}
        {step === 2 && <fieldset><legend className="label">Product preferences</legend><div className="space-y-2">{[['fragranceFree', 'Fragrance-free'], ['vegan', 'Vegan'], ['crueltyFree', 'Cruelty-free']].map(([k, l]) => <label key={k} className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-[#BB1042]" checked={!!p.preferences[k]} onChange={(e) => setP({ ...p, preferences: { ...p.preferences, [k]: e.target.checked } })} />{l}</label>)}</div><p className="mt-3 text-sm text-muted">Undertone and depth are set in the <a className="underline" href="/shade-finder">shade finder</a>.</p></fieldset>}
        {step === 3 && <><Notice tone="info">These questions are optional and kept separate from your account details. They’re encrypted, never shown to sellers, and never used for ads. You can withdraw consent any time.</Notice>
          <label className="flex items-start gap-2"><input type="checkbox" className="mt-1 h-5 w-5 accent-[#BB1042]" checked={useSens} onChange={(e) => { setUseSens(e.target.checked); if (!e.target.checked) setSConsent(false); }} /><span>I’d like to add private details for more careful matching.</span></label>
          {useSens && <div className="space-y-5"><label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#BB1042]" checked={sConsent} onChange={(e) => setSConsent(e.target.checked)} />I agree to Darpana storing these details, encrypted, to compare with product ingredients.</label>
            {sConsent && <><div><label className="label">Ingredients or allergens to avoid</label><input className="input" placeholder="e.g. fragrance, lanolin, nuts (comma separated)" value={s.allergies} onChange={(e) => setS({ ...s, allergies: e.target.value })} /><p className="mt-1 text-xs text-muted">A product containing these is marked Not recommended.</p></div>
              <fieldset><legend className="label">Skin conditions you’ve been told about</legend><div className="flex flex-wrap gap-2">{CONDITIONS.map(([v, l]) => <Chip key={v} on={s.conditions.includes(v)} onClick={() => setS({ ...s, conditions: toggle(s.conditions, v) })}>{l}</Chip>)}</div></fieldset>
              <fieldset><legend className="label">Pregnant or breastfeeding?</legend><div className="flex flex-wrap gap-2">{[['yes', 'Yes'], ['no', 'No'], ['prefer_not', 'Prefer not to say']].map(([v, l]) => <Chip key={v} on={s.pregnant === v} onClick={() => setS({ ...s, pregnant: v })}>{l}</Chip>)}</div></fieldset>
              <div><label className="label">Prescription or active products you use</label><input className="input" placeholder="e.g. adapalene (optional)" value={s.treatments} onChange={(e) => setS({ ...s, treatments: e.target.value })} /></div>
              <button type="button" className="text-sm text-bad underline" onClick={async () => { await api('/me/skin-profile/withdraw-sensitive', { body: {} }); toast('Private details removed'); setUseSens(false); setSConsent(false); reload(); }}>Withdraw consent and delete these details</button></>}</div>}</>}
      </div>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#BB1042]" checked={consent} onChange={(e) => setConsent(e.target.checked)} />I agree to Darpana using the answers above to compare products with my profile. Skin Match is guidance, not medical advice.</label>
      <div className="flex flex-wrap items-center gap-3">{step > 0 && <button className="btn-ghost" onClick={() => setStep(step - 1)}>Back</button>}{step < steps.length - 1 && <button className="btn-plum" onClick={() => setStep(step + 1)}>Next</button>}
        <button className="btn-primary" disabled={!consent || busy} onClick={save}>{busy ? 'Saving…' : 'Save profile'}</button>
        {data?.exists && <button className="ml-auto text-sm text-bad underline" onClick={async () => { if (confirm('Delete your entire skin profile?')) { await api('/me/skin-profile', { method: 'DELETE' }); toast('Profile deleted'); window.location.reload(); } }}>Delete my profile</button>}</div>
      {data?.exists && <p className="text-sm text-muted">Profile completion: <strong className="tnum">{data.completion}%</strong></p>}
    </div>
  );
}
