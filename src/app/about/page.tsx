import Link from 'next/link';

export const metadata = { title: 'About us' };
export default function About() {
  return (
    <div className="container max-w-3xl space-y-6 py-14">
      <p className="font-script text-3xl text-coral">Our story</p>
      <h1>Beauty that fits you, explained.</h1>
      <p className="text-lg text-muted">Darpana means “mirror”. We built a marketplace where independent sellers list their cosmetics, and shoppers can see, in plain language, how each product lines up with the skin profile they choose to share.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {[['Fit before hype', 'Every product page explains why it may or may not suit your declared profile.'], ['Honest, not medical', 'We compare your preferences with listed ingredients. We never diagnose or promise a product is safe.'], ['Private by design', 'Skin details are optional, consent-based, encrypted and never shared with sellers.']].map(([t, d]) => <div key={t} className="card p-5"><h3 className="text-lg">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}
      </div>
      <p className="text-muted">Sellers are reviewed and approved by our team before they can list products, and listings are checked for complete ingredient information.</p>
      <div className="flex flex-wrap gap-3"><Link href="/products" className="btn-primary">Shop now</Link><Link href="/register?type=seller" className="btn-ghost">Sell on Darpana</Link></div>
    </div>
  );
}
