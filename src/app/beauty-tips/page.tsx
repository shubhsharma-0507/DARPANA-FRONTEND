import Link from 'next/link';

export const metadata = { title: 'Beauty tips' };
const tips = [
  ['Patch-test first', 'Try a new product on a small area, like behind the ear or inner forearm, and wait before using it on your face. Stop use if you notice irritation.'],
  ['Read the full ingredient list', 'Check the list for anything you already know you avoid. Our product pages show the full list and flag matches with your avoid list.'],
  ['Find your foundation by undertone and depth', 'Test shades along the jawline in daylight. Screens change colours, so treat online swatches as a guide. Our shade finder suggests three close options.'],
  ['Introduce one new active at a time', 'Adding several strong products at once makes it hard to tell what suits you. If you have a skin condition or use prescription products, check with your doctor.'],
  ['Sunscreen is a daily step', 'Apply it as the last skincare step in the morning and reapply as the product instructions say.'],
];
export default function Tips() {
  return (
    <div className="container max-w-3xl space-y-6 py-14">
      <p className="font-script text-3xl text-coral">Little things that help</p>
      <h1>Beauty tips</h1>
      <p className="text-muted">General guidance only. It is not medical advice.</p>
      <ol className="space-y-4">{tips.map(([t, d], i) => <li key={t} className="card flex gap-4 p-5"><span aria-hidden className="font-serif text-3xl text-rose">{i + 1}</span><div><h2 className="text-xl">{t}</h2><p className="mt-1 text-muted">{d}</p></div></li>)}</ol>
      <Link href="/account/skin-profile" className="btn-primary">Build my skin profile</Link>
    </div>
  );
}
