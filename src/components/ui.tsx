'use client';
import { createContext, useCallback, useContext, useState } from 'react';

export const Spinner = ({ label = 'Loading' }: { label?: string }) => (
  <div role="status" className="flex items-center gap-2 text-muted"><span className="h-4 w-4 animate-spin rounded-full border-2 border-rose border-t-transparent" aria-hidden /><span className="text-sm">{label}…</span></div>
);
export const Skeleton = ({ className = 'h-24' }: { className?: string }) => <div className={`skeleton ${className}`} aria-hidden />;
export const PageLoading = () => <div className="space-y-4" aria-busy="true"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-40" /><Skeleton className="h-40" /></div>;

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card flex flex-col items-start gap-3 border-bad/30 p-5">
      <p className="font-medium text-bad">We couldn’t load this</p><p className="text-sm text-muted">{message}</p>
      {onRetry && <button className="btn-ghost btn-sm" onClick={onRetry}>Try again</button>}
    </div>
  );
}
export function Empty({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return <div className="card flex flex-col items-center gap-2 p-10 text-center"><h3>{title}</h3>{hint && <p className="max-w-md text-muted">{hint}</p>}{action && <div className="mt-2">{action}</div>}</div>;
}
export function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}{hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}{error && <p role="alert" className="mt-1 text-sm text-bad">{error}</p>}</div>;
}
export const Notice = ({ tone = 'info', children }: { tone?: 'info' | 'warn' | 'bad' | 'ok'; children: React.ReactNode }) => {
  const t = { info: 'bg-sky-soft border-sky', warn: 'bg-[#FFF7E6] border-warn/40', bad: 'bg-[#FEF1F0] border-bad/40', ok: 'bg-[#EAF6F0] border-ok/40' }[tone];
  return <div role={tone === 'bad' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${t}`}>{children}</div>;
};
export const Badge = ({ children, tone = 'plain' }: { children: React.ReactNode; tone?: 'plain' | 'ok' | 'warn' | 'bad' | 'plum' }) => {
  const t = { plain: 'bg-[#F1ECE7] text-ink', ok: 'bg-[#E3F3EA] text-ok', warn: 'bg-[#FBEFD9] text-warn', bad: 'bg-[#FBE4E1] text-bad', plum: 'bg-plum-soft text-plum' }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${t}`}>{children}</span>;
};
export const statusTone = (s: string) => (['approved', 'delivered', 'captured', 'active', 'confirmed', 'refunded', 'accepted'].includes(s) ? 'ok' : ['rejected', 'cancelled', 'failed', 'suspended', 'not_recommended'].includes(s) ? 'bad' : ['draft', 'pending_payment', 'created'].includes(s) ? 'plain' : 'warn') as 'ok' | 'bad' | 'plain' | 'warn';
export const StatusBadge = ({ s }: { s?: string }) => <Badge tone={statusTone(s ?? '')}>{(s ?? '').replace(/_/g, ' ')}</Badge>;

const LEVELS: Record<string, { label: string; icon: string; cls: string }> = {
  great: { label: 'Great match', icon: '✓', cls: 'bg-[#E3F3EA] text-ok border-ok/40' },
  good: { label: 'Good match', icon: '✓', cls: 'bg-[#EAF3F7] text-[#2B6A85] border-sky' },
  caution: { label: 'Use with caution', icon: '!', cls: 'bg-[#FBEFD9] text-warn border-warn/40' },
  not_recommended: { label: 'Not recommended', icon: '✕', cls: 'bg-[#FBE4E1] text-bad border-bad/40' },
};
export const MatchBadge = ({ level, score }: { level: string; score?: number }) => {
  const l = LEVELS[level] ?? LEVELS.caution;
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${l.cls}`}><span aria-hidden className="font-bold">{l.icon}</span>{l.label}{score != null && <span className="tnum opacity-80">· {score}</span>}</span>;
};
export const Stars = ({ value, count }: { value: number; count?: number }) => (
  <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rated ${value} out of 5`}>
    <span aria-hidden className="text-rose">{'★'.repeat(Math.round(value))}<span className="text-line">{'★'.repeat(5 - Math.round(value))}</span></span>
    {count != null && <span className="text-muted">({count})</span>}
  </span>
);

// ---- Toasts ----
const T = createContext<(msg: string, tone?: 'ok' | 'bad') => void>(() => {});
export const useToast = () => useContext(T);
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string; tone: string }[]>([]);
  const push = useCallback((msg: string, tone: 'ok' | 'bad' = 'ok') => { const id = Date.now() + Math.random(); setItems((x) => [...x, { id, msg, tone }]); setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4200); }, []);
  return (
    <T.Provider value={push}>{children}
      <div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        {items.map((i) => <div key={i.id} className={`rounded-full px-5 py-2.5 text-sm text-white shadow-card ${i.tone === 'ok' ? 'bg-plum' : 'bg-bad'}`}>{i.msg}</div>)}
      </div>
    </T.Provider>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="card max-h-[90vh] w-full overflow-auto rounded-b-none p-6 sm:max-w-lg sm:rounded-b-card" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3>{title}</h3><button className="btn-ghost btn-sm" onClick={onClose} aria-label="Close">Close</button></div>
        {children}
      </div>
    </div>
  );
}
export const DISCLAIMER = "Based on the information you shared and the product's listed ingredients. Not medical advice. Patch-test new products and stop use if irritation occurs.";
