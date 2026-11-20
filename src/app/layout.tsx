import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/fraunces';
import '@fontsource/great-vibes';
import '@fontsource-variable/inter';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/ui';
import { Footer, Header } from '@/components/Chrome';

export const metadata: Metadata = {
  title: { default: 'Darpana Cosmetics – Formulations Engineered for Discernment', template: '%s · Darpana' },
  description: 'A curated digital sanctuary bridging dermatological rigor, ingredient authenticity, and high-fashion cosmetic discernment.',
  icons: { icon: '/favicon.ico' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#50061C' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ivory text-ink selection:bg-rose/20 selection:text-plum">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-2">Skip to content</a>
        <AuthProvider><ToastProvider>
          <Header />
          <div id="main" className="min-h-[60vh]">{children}</div>
          <Footer />
        </ToastProvider></AuthProvider>
      </body>
    </html>
  );
}
