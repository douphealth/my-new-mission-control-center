import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '../lib/auth';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'AmzWP Automator — Amazon affiliate WordPress automation' },
      {
        name: 'description',
        content:
          'Generate Amazon-affiliate posts from your sitemap and publish to WordPress. AI-powered, EEAT-ready, with auto price refresh.',
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.navigate({ to: '/dashboard' });
    }
  }, [loading, router, session]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-dark-950 flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-dark-950 text-white">
      <header className="border-b border-dark-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-black text-lg tracking-tight">
            AmzWP<span className="text-brand-500">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              search={{ redirect: '/dashboard' }}
              className="text-sm font-bold text-gray-400 hover:text-white px-3 py-2 transition"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold bg-brand-500 hover:bg-brand-400 text-white px-4 py-2 rounded-lg transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-400 font-bold mb-6">
          Amazon affiliate · WordPress · AI
        </p>
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
          Stop hand-publishing.
          <br />
          <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
            Automate your affiliate site.
          </span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
          Scan a sitemap, generate AI-optimized Amazon-affiliate content, and publish to WordPress in
          minutes. Built for affiliate marketers who manage multiple sites.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="bg-brand-500 hover:bg-brand-400 text-white font-bold px-6 py-3 rounded-xl transition"
          >
            Create free account
          </Link>
          <Link
            to="/login"
            search={{ redirect: '/dashboard' }}
            className="text-gray-300 hover:text-white font-bold px-6 py-3 rounded-xl border border-dark-800 hover:border-dark-700 transition"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Feature
          title="Sitemap-first scanning"
          desc="Point us at your WP sitemap and we'll surface every post that's missing affiliate boxes or has stale prices."
        />
        <Feature
          title="AI-written, EEAT-ready"
          desc="Reviews, comparison tables, and product boxes generated with real product data — not generic fluff."
        />
        <Feature
          title="Multi-site management"
          desc="Run as many WordPress sites as you want from one dashboard. Stop juggling logins."
        />
      </section>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}
