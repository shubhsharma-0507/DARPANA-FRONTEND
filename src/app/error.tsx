'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return <div className="container flex flex-col items-center gap-3 py-24 text-center"><h1>Something went wrong</h1><p className="text-muted">Please try again. If it keeps happening, come back in a few minutes.</p><button className="btn-primary" onClick={reset}>Try again</button></div>;
}
