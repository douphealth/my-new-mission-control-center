import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export const Route = createFileRoute('/dashboard/')({
  head: () => ({
    meta: [{ title: 'Dashboard — AmzWP Automator' }],
  }),
  component: DashboardHome,
});

function DashboardHome() {
  const [stats, setStats] = useState({ sites: 0, posts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [sites, posts] = await Promise.all([
        supabase.from('sites').select('id', { count: 'exact', head: true }),
        supabase.from('generated_blog_posts').select('id', { count: 'exact', head: true }),
      ]);
      setStats({ sites: sites.count ?? 0, posts: posts.count ?? 0 });
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">Dashboard</h1>
        <p className="text-gray-500">Overview of your automation pipeline.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="WordPress sites" value={stats.sites} loading={loading} />
        <StatCard label="Generated posts" value={stats.posts} loading={loading} />
        <StatCard label="Auto-refreshes" value={0} loading={loading} hint="Coming soon" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionCard
          title="Connect a WordPress site"
          desc="Add your WP site so we can publish to it."
          to="/dashboard/sites"
          cta="Manage sites"
        />
        <ActionCard
          title="Open the generator"
          desc="Scan a sitemap and generate Amazon-affiliate content."
          to="/dashboard/generator"
          cta="Open generator"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
  hint,
}: {
  label: string;
  value: number;
  loading: boolean;
  hint?: string;
}) {
  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6">
      <p className="text-xs uppercase tracking-widest text-gray-500 font-bold">{label}</p>
      <p className="text-4xl font-black mt-3">{loading ? '—' : value}</p>
      {hint && <p className="text-xs text-gray-600 mt-2">{hint}</p>}
    </div>
  );
}

function ActionCard({
  title,
  desc,
  to,
  cta,
}: {
  title: string;
  desc: string;
  to: '/dashboard/sites' | '/dashboard/generator';
  cta: string;
}) {
  return (
    <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 flex flex-col">
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-gray-500 text-sm mb-6 flex-1">{desc}</p>
      <Link
        to={to}
        className="self-start text-sm font-bold text-brand-400 hover:text-brand-300 transition"
      >
        {cta} →
      </Link>
    </div>
  );
}
