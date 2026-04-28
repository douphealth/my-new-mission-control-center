import { createFileRoute } from '@tanstack/react-router';
import { AuthForm } from '../components/auth/AuthForm';

export const Route = createFileRoute('/signup')({
  head: () => ({
    meta: [
      { title: 'Create account — AmzWP Automator' },
      { name: 'description', content: 'Create an account to automate Amazon affiliate publishing.' },
    ],
  }),
  component: () => <AuthForm mode="signup" />,
});
