'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, errMsg } from './api';

export function useFetch<T = any>(path: string | null, query?: Record<string, any>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!path);
  const key = path ? path + JSON.stringify(query ?? {}) : '';
  const seq = useRef(0);
  const load = useCallback(async () => {
    if (!path) return;
    const my = ++seq.current; setLoading(true); setError(null);
    try { const d = await api<T>(path, { query }); if (my === seq.current) setData(d); }
    catch (e) { if (my === seq.current) setError(errMsg(e)); }
    finally { if (my === seq.current) setLoading(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => { load(); }, [load]);
  return { data, error, loading, reload: load, setData };
}
