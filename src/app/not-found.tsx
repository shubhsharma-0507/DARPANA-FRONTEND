import Link from 'next/link';
export default function NotFound() {
  return <div className="container flex flex-col items-center gap-3 py-24 text-center"><h1>Page not found</h1><p className="text-muted">That page doesn’t exist or has moved.</p><Link href="/" className="btn-primary">Back to home</Link></div>;
}
