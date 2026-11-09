'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Empty } from '@/components/ui';
import { money } from '@/lib/api';
import { useSiteConfig } from '@/lib/site';

export default function Offers() {
  const cfg = useSiteConfig(); const [copied, setCopied] = useState('');
  return (
    <div className="container max-w-3xl space-y-6 py-14">
      <p className="font-script text-3xl text-coral">Look beautiful, save more</p>
      <h1>Offers</h1>
      {cfg && cfg.offers.length === 0 && <Empty title="No offers right now" hint="Check back soon." action={<Link href="/products" className="btn-primary">Browse products</Link>} />}
      <ul className="grid gap-4 sm:grid-cols-2">
        {cfg?.offers.map((o) => (
          <li key={o.code} className="card overflow-hidden"><div className="bg-gradient-to-r from-[#7E0A29] to-[#5C1227] p-5 text-white"><p className="font-serif text-4xl font-bold text-gold">{o.percent}% OFF</p><p className="mt-1 text-sm text-white/80">on orders above {money(o.minSubtotal)}</p></div>
            <div className="flex items-center justify-between p-4"><code className="tnum rounded bg-blush-soft px-3 py-1.5 font-semibold tracking-wider">{o.code}</code><button className="btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(o.code); setCopied(o.code); }}>{copied === o.code ? 'Copied' : 'Copy code'}</button></div></li>
        ))}
      </ul>
      <p className="text-sm text-muted">Enter the code at checkout. One code per order.</p>
    </div>
  );
}
