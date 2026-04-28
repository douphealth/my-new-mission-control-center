import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

// The legacy generator (sitemap scanner + post editor) lives in App.tsx and
// uses a Zustand store with localStorage, so render it client-only.
const LegacyApp = lazy(() => import('../../App'));

export const Route = createFileRoute('/dashboard/generator')({
  head: () => ({
    meta: [{ title: 'Generator — AmzWP Automator' }],
  }),
  component: GeneratorPage,
});

function GeneratorPage() {
  return (
    <div className="-mx-6 -my-10">
      <ClientOnly fallback={<Spinner />}>
        <Suspense fallback={<Spinner />}>
          <LegacyApp />
        </Suspense>
      </ClientOnly>
    </div>
  );
}

function Spinner() {
  return (
    <div className="h-[60vh] flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
