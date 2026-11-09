'use client';
import { Guard, SideLayout } from '@/components/Chrome';
export default function L({ children }: { children: React.ReactNode }) {
  return <Guard role="ADMIN"><SideLayout title="Admin" links={[['/admin', 'Overview'], ['/admin/users', 'Buyers & users'], ['/admin/sellers', 'Sellers & KYC'], ['/admin/catalog', 'Brands & categories'], ['/admin/products', 'Product approvals'], ['/admin/orders', 'Orders'], ['/admin/returns', 'Returns'], ['/admin/settlements', 'Settlements'], ['/admin/ingredients', 'Ingredients & rules'], ['/admin/reviews', 'Review moderation'], ['/admin/settings', 'Settings'], ['/admin/audit', 'Audit logs']]}>{children}</SideLayout></Guard>;
}
