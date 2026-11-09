'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api';

export type Role = 'BUYER' | 'SHOP_OWNER' | 'ADMIN';
export interface Me { id: string; name: string; email: string; role: Role; emailVerified: boolean; mfaEnabled: boolean }
interface Ctx { me: Me | null; seller: { status: string; shopName: string; adminComment?: string; kycComplete?: boolean } | null; wishlistCount: number; setWishlistCount: (n: number) => void; loading: boolean; reload: () => Promise<void>; logout: () => Promise<void>; cartCount: number; setCartCount: (n: number) => void }
const C = createContext<Ctx>({} as Ctx);
export const useAuth = () => useContext(C);
export const homeFor = (r: Role) => (r === 'ADMIN' ? '/admin' : r === 'SHOP_OWNER' ? '/seller' : '/account');

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [seller, setSeller] = useState<Ctx['seller']>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const reload = useCallback(async () => {
    try {
      const r = await api('/auth/me'); setMe(r.user); setSeller(r.seller ?? null);
      if (r.user.role === 'BUYER') {
        api('/cart').then((c) => setCartCount(c.itemCount ?? 0)).catch(() => {});
        api('/wishlist').then((w) => setWishlistCount(w.items?.length ?? 0)).catch(() => {});
      }
    } catch { setMe(null); setSeller(null); setCartCount(0); setWishlistCount(0); } finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  const logout = useCallback(async () => { await api('/auth/logout', { method: 'POST', body: {} }).catch(() => {}); setMe(null); setSeller(null); setCartCount(0); window.location.href = '/'; }, []);
  return <C.Provider value={{ me, seller, loading, reload, logout, cartCount, setCartCount, wishlistCount, setWishlistCount }}>{children}</C.Provider>;
}
