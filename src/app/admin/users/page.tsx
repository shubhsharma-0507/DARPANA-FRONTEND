'use client';
import { useState } from 'react';
import { ErrorBox, PageLoading, StatusBadge, useToast } from '@/components/ui';
import { api, errMsg } from '@/lib/api';
import { useFetch } from '@/lib/hooks';

export default function Users() {
  const [role, setRole] = useState(''); const [search, setSearch] = useState(''); const [applied, setApplied] = useState('');
  const { data, loading, error, reload } = useFetch<any>('/admin/users', { role, search: applied }); const toast = useToast();
  async function act(id: string, status: 'active' | 'suspended') { const reason = prompt(status === 'suspended' ? 'Reason for suspending (required)' : 'Reason for restoring'); if (!reason) return; try { await api(`/admin/users/${id}/status`, { body: { status, reason } }); toast('Updated'); reload(); } catch (e) { toast(errMsg(e), 'bad'); } }
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Users</h1><div className="flex flex-wrap gap-2"><select className="input !w-auto" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role"><option value="">All roles</option><option value="BUYER">Buyers</option><option value="SHOP_OWNER">Shop owners</option><option value="ADMIN">Admins</option></select><input className="input !w-64" placeholder="Search name or email" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setApplied(search)} /><button className="btn-ghost" onClick={() => setApplied(search)}>Search</button></div>
    {loading ? <PageLoading /> : error ? <ErrorBox message={error} onRetry={reload} /> : <div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead><tbody>{data.items.map((u: any) => <tr key={u._id} className="border-b border-line last:border-0"><td className="p-3">{u.name}</td><td>{u.email}</td><td>{u.role}</td><td><StatusBadge s={u.status} /></td><td className="p-3 text-right">{u.role !== 'ADMIN' && (u.status === 'active' ? <button className="btn-ghost btn-sm" onClick={() => act(u._id, 'suspended')}>Suspend</button> : <button className="btn-ghost btn-sm" onClick={() => act(u._id, 'active')}>Restore</button>)}</td></tr>)}</tbody></table></div>}</div>;
}
