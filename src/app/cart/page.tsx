'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProductImage } from '@/components/ProductCard';
import { Empty, ErrorBox, MatchBadge, Notice, PageLoading, useToast } from '@/components/ui';
import { api, errMsg, money } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { useFetch } from '@/lib/hooks';

export default function CartPage() {
  const { me, loading: al, setCartCount } = useAuth(); const router = useRouter(); const toast = useToast();
  const { data, loading, error, reload, setData } = useFetch<any>(me?.role === 'BUYER' ? '/cart' : null);
  if (al) return <div className="container py-10"><PageLoading /></div>;
  if (!me) return <div className="container py-10"><Empty title="Sign in to see your cart" hint="Your cart is saved to your account." action={<Link className="btn-primary" href="/login?next=/cart">Sign in</Link>} /></div>;
  if (me.role !== 'BUYER') return <div className="container py-10"><Empty title="Carts are for shopper accounts" /></div>;
  if (loading) return <div className="container py-10"><PageLoading /></div>;
  if (error) return <div className="container py-10"><ErrorBox message={error} onRetry={reload} /></div>;
  async function setQty(id: string, qty: number) { try { const c = await api(`/cart/items/${id}`, { method: 'PATCH', body: { qty } }); setData(c); setCartCount(c.itemCount); } catch (e) { toast(errMsg(e), 'bad'); } }
  if (!data?.groups.length) return <div className="container py-10"><Empty title="Your cart is empty" hint="Find something that suits your skin profile." action={<Link className="btn-primary" href="/products">Browse products</Link>} /></div>;
  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6"><h1 className="text-3xl md:text-4xl">Your cart</h1>
        {data.problems.map((p: string) => <Notice key={p} tone="warn">{p}</Notice>)}
        {data.hasNotRecommended && <Notice tone="bad"><strong>Some items are marked Not recommended for your profile.</strong> Review the reasons on each product page before you check out.</Notice>}
        {data.groups.map((g: any) => <section key={g.seller.id} className="card"><div className="flex items-center justify-between border-b border-line p-4"><p className="font-medium">Sold by {g.seller.shopName}</p><p className="text-sm text-muted">Ships in {g.dispatchDays} day{g.dispatchDays === 1 ? '' : 's'}</p></div>
          <ul className="divide-y divide-line">{g.items.map((i: any) => <li key={i.listingId} className="flex gap-4 p-4"><div className="w-20 shrink-0 overflow-hidden rounded-lg"><ProductImage src={i.image} title={i.title} /></div>
            <div className="min-w-0 flex-1"><Link href={`/products/${i.slug}`} className="font-medium hover:underline">{i.title}</Link><p className="text-sm text-muted">{i.variant}</p>{i.matchLevel && <div className="mt-1"><MatchBadge level={i.matchLevel} /></div>}
              <div className="mt-2 flex items-center gap-3"><div className="flex items-center rounded-full border border-line"><button className="h-9 w-9" aria-label="Decrease quantity" onClick={() => setQty(i.listingId, i.qty - 1)}>−</button><span className="tnum w-6 text-center">{i.qty}</span><button className="h-9 w-9" aria-label="Increase quantity" disabled={i.qty >= Math.min(10, i.stock)} onClick={() => setQty(i.listingId, i.qty + 1)}>+</button></div><button className="text-sm text-muted underline" onClick={() => setQty(i.listingId, 0)}>Remove</button></div></div>
            <p className="tnum font-medium">{money(i.lineTotal)}</p></li>)}</ul></section>)}
      </div>
      <aside className="card h-fit space-y-3 p-5 lg:sticky lg:top-28"><h2 className="text-xl">Summary</h2>
        <div className="flex justify-between"><span className="text-muted">Subtotal</span><span className="tnum">{money(data.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-muted">Delivery</span><span className="tnum">{data.shipping ? money(data.shipping) : 'Free'}</span></div>
        <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><span>Total</span><span className="tnum">{money(data.total)}</span></div>
        <button className="btn-primary w-full" disabled={data.problems.length > 0} onClick={() => router.push('/checkout')}>Continue to checkout</button>
        {data.problems.length > 0 && <p className="text-xs text-muted">Fix the items above to continue.</p>}</aside>
    </div>
  );
}
