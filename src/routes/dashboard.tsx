import {
  createFileRoute,
  Outlet,
  useRouter,
  Link,
} from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '../lib/auth';

export const Route = createFileRoute('/dashboard')({
  component: DashboardChrome,
});

function DashboardChrome() {
  const { user, signOut, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.navigate({ to: '/login' });
    }
  }, [loading, router, session]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: '/login' });
  };

  return (
    <div className="min-h-dvh bg-dark-950 text-white">
      <header className="border-b border-dark-800 bg-dark-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="font-black text-lg tracking-tight">
              AmzWP<span className="text-brand-500">.</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link
                to="/dashboard"
                activeOptions={{ exact: true }}
                activeProps={{ className: 'text-white font-bold' }}
                className="text-gray-400 hover:text-white transition"
              >
                Overview
              </Link>
              <Link
                to="/dashboard/sites"
                activeProps={{ className: 'text-white font-bold' }}
                className="text-gray-400 hover:text-white transition"
              >
                Sites
              </Link>
              <Link
                to="/dashboard/generator"
                activeProps={{ className: 'text-white font-bold' }}
                className="text-gray-400 hover:text-white transition"
              >
                Generator
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 hidden sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white border border-dark-700 hover:border-dark-600 rounded-lg px-3 py-2 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}
