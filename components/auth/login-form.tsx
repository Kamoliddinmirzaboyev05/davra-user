'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send magic link');
        return;
      }

      setSent(true);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">Check your email!</h3>
            <p className="text-slate-300">
              We sent a magic link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-slate-400">
              Click the link in the email to sign in.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setSent(false)}
          variant="outline"
          className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          Use different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendMagicLink} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-200 text-xs space-y-1">
          <p className="font-semibold">🧪 Development mode:</p>
          <p>Check your email for the magic link</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !email || !email.includes('@')}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          'Send Magic Link'
        )}
      </Button>

      <p className="text-xs text-slate-400 text-center">
        We'll send you a magic link to sign in
      </p>
    </form>
  );
}
