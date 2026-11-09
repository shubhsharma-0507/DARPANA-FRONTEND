'use client';
import { Guard, SideLayout } from '@/components/Chrome';
export default function L({ children }: { children: React.ReactNode }) {
  return <Guard role="BUYER"><SideLayout title="My account" links={[['/account', 'Profile'], ['/account/orders', 'Orders'], ['/account/returns', 'Returns & refunds'], ['/account/addresses', 'Addresses'], ['/account/wishlist', 'Wishlist'], ['/account/skin-profile', 'Skin profile'], ['/account/shelf', 'My Shelf'], ['/account/security', 'Security & privacy']]}>{children}</SideLayout></Guard>;
}
