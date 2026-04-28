import { createFileRoute } from '@tanstack/react-router';
import { AuthForm } from '@/components/auth/AuthForm';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Sign in — AmzWP Automator' },
      { name: 'description', content: 'Sign in to manage your Amazon affiliate WordPress automation.' },
    ],
  }),
  component: () => <AuthForm mode="signin" />,
});
