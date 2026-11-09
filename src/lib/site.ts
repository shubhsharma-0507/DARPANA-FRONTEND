'use client';
import { useEffect, useState } from 'react';
import { api } from './api';

export interface SiteConfig { freeShippingAbove: number; flatShipping: number; offers: { code: string; percent: number; minSubtotal: number }[] }
let cache: SiteConfig | null = null;
/** Public settings (free-shipping threshold, active offers) so banners never show made-up numbers. */
export function useSiteConfig() {
  const [cfg, setCfg] = useState<SiteConfig | null>(cache);
  useEffect(() => { if (!cache) api<SiteConfig>('/site-config').then((c) => { cache = c; setCfg(c); }).catch(() => {}); }, []);
  return cfg;
}
