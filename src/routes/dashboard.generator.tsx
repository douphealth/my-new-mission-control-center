import { createFileRoute } from '@tanstack/react-router';
import App from '@/App';

// The legacy generator lives in App.tsx. Keep the import static so route
// loading cannot fail on a separate /App.tsx module fetch.

export const Route = createFileRoute('/dashboard/generator')({
  head: () => ({
    meta: [{ title: 'Generator — AmzWP Automator' }],
  }),
  component: GeneratorPage,
});

function GeneratorPage() {
  return (
    <div className="-mx-6 -my-10 min-h-[calc(100dvh-5rem)] overflow-hidden bg-dark-950">
      <App />
    </div>
  );
}
