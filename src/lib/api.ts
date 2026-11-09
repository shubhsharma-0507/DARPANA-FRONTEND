export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public fieldErrors?: Record<string, string[] | undefined>) { super(message); }
}
let refreshing: Promise<boolean> | null = null;
async function refresh() {
  refreshing ??= fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' }).then((r) => r.ok).catch(() => false).finally(() => { setTimeout(() => (refreshing = null), 0); });
  return refreshing;
}
export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; query?: Record<string, string | number | boolean | undefined | null> } = {}, retry = true): Promise<T> {
  const qs = opts.query ? '?' + new URLSearchParams(Object.entries(opts.query).filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => [k, String(v)])).toString() : '';
  let res: Response;
  try {
    res = await fetch(`/api/v1${path}${qs}`, { method: opts.method ?? (opts.body ? 'POST' : 'GET'), credentials: 'include', headers: opts.body ? { 'Content-Type': 'application/json' } : undefined, body: opts.body ? JSON.stringify(opts.body) : undefined });
  } catch { throw new ApiError(0, 'NETWORK', 'Cannot reach the server. Check your connection and try again.'); }
  if (res.status === 401 && retry && !path.startsWith('/auth/') && (await refresh())) return api<T>(path, opts, false);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.code ?? 'ERROR', data.message ?? 'Something went wrong', data.fieldErrors);
  return data as T;
}
export const money = (n: number | undefined | null) => '₹' + Number(n ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
export const errMsg = (e: unknown) => (e instanceof ApiError ? e.message : 'Something went wrong. Please try again.');
export const fieldErr = (e: unknown, f: string) => (e instanceof ApiError ? e.fieldErrors?.[f]?.[0] : undefined);
