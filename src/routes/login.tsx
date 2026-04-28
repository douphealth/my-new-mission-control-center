import { createFileRoute } from '@tanstack/react-router';
import { AuthForm } from '../components/auth/AuthForm';

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : '/dashboard',
  }),
  head: () => ({
    meta: [
      { title: 'Sign in — AmzWP Automator' },
      { name: 'description', content: 'Sign in to manage your Amazon affiliate WordPress automation.' },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  return <AuthForm mode="signin" redirectTo={redirect} />;
}
