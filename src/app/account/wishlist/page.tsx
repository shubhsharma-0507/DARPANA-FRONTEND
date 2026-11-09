'use client';
import Link from 'next/link';
import { ProductImage } from '@/components/ProductCard';
import { Badge, Empty, ErrorBox, PageLoading } from '@/components/ui';
import { api } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Wishlist() {
  const { data, loading, error, reload } = useFetch<any>('/wishlist');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Wishlist</h1>{!data.items.length && <Empty title="Nothing saved yet" action={<Link href="/products" className="btn-primary">Browse products</Link>} />}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">{data.items.map((p: any) => <div key={p.id} className="card overflow-hidden"><ProductImage src={p.image} title={p.title} /><div className="space-y-2 p-3"><Link href={`/products/${p.slug}`} className="line-clamp-2 font-medium">{p.title}</Link>{p.unavailable && <Badge tone="warn">Unavailable</Badge>}<button className="block text-sm text-muted underline" onClick={() => api(`/wishlist/${p.id}`, { method: 'DELETE' }).then(reload)}>Remove</button></div></div>)}</div></div>;
}
