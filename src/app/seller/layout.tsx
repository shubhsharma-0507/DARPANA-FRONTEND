'use client';
import Link from 'next/link';
import { Guard, SideLayout } from '@/components/Chrome';
import { Notice } from '@/components/ui';
import { useAuth } from '@/lib/auth';

function Banner() {
  const { seller } = useAuth();
  if (!seller || seller.status === 'approved') return null;
  const msg: Record<string, string> = {
    draft: 'Finish your seller application to start selling.',
    submitted: seller.kycComplete ? 'Your request has been sent to the Darpana admin and is waiting for approval.' : 'Your request has been sent to the Darpana admin. Complete your business and KYC details so they can approve it.',
    under_review: 'Your application is under review by the Darpana admin.', rejected: 'Your application needs changes. Update it and submit again.', suspended: 'Your seller account is suspended.',
  };
  return <div className="mb-4"><Notice tone={seller.status === 'rejected' || seller.status === 'suspended' ? 'bad' : 'warn'}><strong>{msg[seller.status]}</strong>{seller.status === 'submitted' && !seller.kycComplete && <> <Link href="/seller/apply" className="underline">Complete details</Link>.</>}{seller.adminComment && <> Note from Darpana: {seller.adminComment}</>}</Notice></div>;
}
export default function L({ children }: { children: React.ReactNode }) {
  return <Guard role="SHOP_OWNER"><SideLayout title="Seller portal" links={[['/seller', 'Overview'], ['/seller/apply', 'Application & KYC'], ['/seller/products', 'Products'], ['/seller/products/new', 'Add product'], ['/seller/inventory', 'Inventory'], ['/seller/orders', 'Orders'], ['/seller/returns', 'Returns'], ['/seller/earnings', 'Earnings'], ['/seller/settings', 'Shop settings']]}><Banner />{children}</SideLayout></Guard>;
}
