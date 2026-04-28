import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

// Lazy-load the legacy App so it only runs on the client
// (the Zustand store uses localStorage which is unavailable during SSR).
const App = lazy(() => import('../../App'));

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <ClientOnly
      fallback={
        <div className="h-dvh w-screen bg-dark-950 flex items-center justify-center">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-brand-500 rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="h-dvh w-screen bg-dark-950 flex items-center justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-brand-500 rounded-full animate-spin" />
            </div>
          </div>
        }
      >
        <App />
      </Suspense>
    </ClientOnly>
  );
}
