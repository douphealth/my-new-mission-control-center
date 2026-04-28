import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth';

interface Props {
  mode: 'signin' | 'signup';
}

export function AuthForm({ mode }: Props) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const fn = mode === 'signin' ? signIn : signUp;
      const { error, session } = await fn(email.trim(), password);
      if (error) {
        toast.error(error.message);
        return;
      }
      if (mode === 'signup') {
        if (!session) {
          toast.success('Account created — confirm your email, then sign in.');
          navigate({ to: '/login' });
          return;
        }
        toast.success('Account created.');
      } else if (!session) {
        toast.error('Login did not create a session. Please try again.');
        return;
      } else {
        toast.success('Welcome back.');
      }
      navigate({ to: '/dashboard' });
    } finally {
      setBusy(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="min-h-dvh bg-dark-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-block mb-8 text-xs uppercase tracking-widest text-gray-500 hover:text-white transition"
        >
          ← Back
        </Link>

        <div className="bg-dark-900 border border-dark-800 rounded-3xl p-8">
          <h1 className="text-3xl font-black text-white mb-2">
            {isSignup ? 'Create account' : 'Sign in'}
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            {isSignup
              ? 'Start automating Amazon affiliate publishing.'
              : 'Welcome back to AmzWP Automator.'}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                Email
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full bg-dark-950 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-brand-500 focus:outline-none transition"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-brand-500 hover:bg-brand-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
            >
              {busy ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-500 text-center">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New here?{' '}
                <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-bold">
                  Create account
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
