import {
  createFileRoute,
  Outlet,
  redirect,
  useRouter,
  Link,
} from '@tanstack/react-router';
import { useAuth, AuthProvider } from '../lib/auth';
import { supabase } from '../integrations/supabase/client';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: '/login' });
    }
  },
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <AuthProvider>
      <DashboardChrome />
    </AuthProvider>
  );
}

function DashboardChrome() {
  const { user, signOut } = useAuth();
  const router = useRouter();

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
