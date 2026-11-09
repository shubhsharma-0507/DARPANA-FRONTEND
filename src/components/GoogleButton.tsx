'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { api, errMsg } from '@/lib/api';
import { Notice } from './ui';

declare global { interface Window { google?: any } }
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/** Google Identity Services. Token is verified server-side; the browser never decides role. */
export function GoogleButton({ onDone, adult18 }: { onDone: (u: any) => void; adult18?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false); const [err, setErr] = useState('');
  // Keep the latest callbacks/flags in refs so the button is rendered once and never re-initialised on re-render.
  const doneRef = useRef(onDone); const adultRef = useRef(adult18);
  doneRef.current = onDone; adultRef.current = adult18;

  // The Google script may already be on the page (client-side navigation), in which case onLoad never fires again.
  useEffect(() => { if (window.google?.accounts?.id) setReady(true); }, []);

  useEffect(() => {
    if (!CLIENT_ID || !ready || !box.current || !window.google?.accounts?.id) return;
    window.google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: async (r: { credential: string }) => {
        try { setErr(''); const d = await api('/auth/google', { body: { idToken: r.credential, adult18Confirmed: adultRef.current || undefined } }); doneRef.current(d.user); }
        catch (e) { setErr(errMsg(e)); }
      },
    });
    box.current.innerHTML = '';
    window.google.accounts.id.renderButton(box.current, { theme: 'outline', size: 'large', width: 320, shape: 'pill', text: 'continue_with' });
  }, [ready]);

  if (!CLIENT_ID) return <p className="text-center text-xs text-muted">Google sign-in appears here once <code>NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> is set.</p>;
  return (
    <div className="flex flex-col items-center gap-2">
      {/* onReady fires on every mount (even if the script was already loaded); onLoad only the first time. */}
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => setReady(true)} />
      <div ref={box} className="flex min-h-[44px] w-full justify-center" aria-label="Continue with Google" />
      {!ready && <p className="text-xs text-muted">Loading Google sign-in…</p>}
      {err && <Notice tone="bad">{err}</Notice>}
    </div>
  );
}
