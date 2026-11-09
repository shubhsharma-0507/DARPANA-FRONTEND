'use client';
import { ErrorBox, PageLoading } from '@/components/ui';
import { useFetch } from '@/lib/hooks';

export default function Audit() {
  const { data, loading, error, reload } = useFetch<any>('/admin/audit-logs');
  if (loading) return <PageLoading />; if (error) return <ErrorBox message={error} onRetry={reload} />;
  return <div className="space-y-4"><h1 className="text-3xl md:text-4xl">Audit logs</h1><div className="card overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-line text-muted"><tr><th className="p-3">When</th><th>Action</th><th>Target</th><th>Reason</th><th>IP</th></tr></thead><tbody>{data.items.map((a: any) => <tr key={a._id} className="border-b border-line last:border-0"><td className="p-3">{new Date(a.timestamp).toLocaleString('en-IN')}</td><td className="font-medium">{a.action}</td><td>{a.target}</td><td>{a.reason}</td><td>{a.ip}</td></tr>)}{!data.items.length && <tr><td colSpan={5} className="p-4 text-muted">No actions recorded yet.</td></tr>}</tbody></table></div></div>;
}
