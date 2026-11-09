'use client';
import Link from 'next/link';
import { Badge, Empty, ErrorBox, Notice, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Products() {
  const { data, loading, error, reload } = useFetch<any>('/seller/products'); const toast = useToast();
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  async function submit(id: string) { try { await api(`/seller/products/${id}/submit`, { body: {} }); toast('Submitted for review'); reload(); } catch (e: any) { toast(e?.fieldErrors?.form?.[0] ?? errMsg(e), 'bad'); } }
  return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-3xl md:text-4xl">Products</h1><Link href="/seller/products/new" className="btn-primary btn-sm">Add product</Link></div>
    {!data.items.length && <Empty title="No products yet" hint="Create a draft, add the full ingredient list, then submit for review." action={<Link href="/seller/products/new" className="btn-primary">Add your first product</Link>} />}
    {data.items.map((p: any) => <div key={p.id} className="card space-y-2 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium">{p.title}</p><div className="flex gap-2">{p.incompleteIngredients && <Badge tone="warn">Ingredients missing</Badge>}<StatusBadge s={p.status} /></div></div>
      {p.reviewNote && <Notice tone={p.status === 'approved' ? 'info' : 'warn'}>Reviewer note: {p.reviewNote}</Notice>}
      <div className="flex flex-wrap gap-2"><Link href={`/seller/products/${p.id}/edit`} className="btn-ghost btn-sm">Edit</Link>{['draft', 'changes_requested', 'rejected'].includes(p.status) && <button className="btn-plum btn-sm" onClick={() => submit(p.id)}>Submit for review</button>}</div></div>)}</div>;
}
