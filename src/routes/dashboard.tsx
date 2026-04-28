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
  errorComponent: ({ error, reset }) => (
    <div className="min-h-dvh bg-dark-950 flex items-center justify-center p-8">
      <div className="bg-dark-900 border border-red-500/30 rounded-2xl p-8 max-w-lg text-center">
        <h1 className="text-2xl font-black text-white mb-3">Something broke</h1>
        <p className="text-gray-400 text-sm mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="bg-white text-dark-950 px-6 py-3 rounded-xl font-bold hover:bg-brand-400 hover:text-white transition"
        >
          Try again
        </button>
      </div>
    </div>
  ),
});

const NAV = [
  { to: '/dashboard', label: 'Overview', exact: true, icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/dashboard/sites', label: 'Sites', icon: 'M3 7h18M3 12h18M3 17h18' },
  { to: '/dashboard/generator', label: 'Generator', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
] as const;

function DashboardChrome() {
  const { user, signOut, loading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.navigate({ to: '/login', search: { redirect: '/dashboard' } });
    }
  }, [loading, router, session]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold">Loading dashboard…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: '/login', search: { redirect: '/dashboard' } });
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="min-h-dvh bg-dark-950 text-white">
      <header className="border-b border-dark-800/80 bg-dark-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-2 font-black text-lg tracking-tight flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-[0_0_20px_-4px_rgba(14,165,233,0.7)]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <span className="hidden sm:inline">AmzWP<span className="text-brand-500">.</span></span>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={item.exact ? { exact: true } : undefined}
                  activeProps={{
                    className:
                      'bg-dark-800 text-white border-dark-700 shadow-inner',
                  }}
                  inactiveProps={{
                    className: 'text-gray-400 hover:text-white border-transparent hover:bg-dark-900',
                  }}
                  className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg border transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-dark-900 border border-dark-800 rounded-full pl-1 pr-3 py-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center font-black text-white text-xs">
                {initial}
              </div>
              <span className="text-xs text-gray-400 font-medium truncate max-w-[160px]">{user?.email}</span>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white border border-dark-800 hover:border-dark-700 hover:bg-dark-900 rounded-lg px-3 py-2 transition"
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
