'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { OTPVerification } from './otp-verification';

export function LoginForm() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugOTP, setDebugOTP] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send OTP');
        return;
      }

      // Store OTP for dev debugging
      if (data.otp) {
        setDebugOTP(data.otp);
      }

      localStorage.setItem('phoneNumber', phoneNumber);
      setStep('otp');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to verify OTP');
        return;
      }

      // Store auth info
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('phoneNumber', data.phoneNumber);

      // Redirect to home
      router.push('/');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <OTPVerification
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOTP}
        onChangePhone={() => setStep('phone')}
        isLoading={isLoading}
        error={error}
        debugOTP={debugOTP}
      />
    );
  }

  return (
    <form onSubmit={handleSendOTP} className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
          Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+998 99 123 45 67"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isLoading}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
        />
        <p className="text-xs text-slate-400 mt-1">Uzbek format: +998 or 0</p>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-200 text-xs space-y-1">
          <p className="font-semibold">🧪 Test raqamlari:</p>
          <p>+998901234567 → OTP: 111111</p>
          <p>+998909999999 → OTP: 999999</p>
          <p>+998900000000 → OTP: 123456</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !phoneNumber}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          'Send OTP'
        )}
      </Button>

      <p className="text-xs text-slate-400 text-center">
        We'll send you a verification code via SMS
      </p>
    </form>
  );
}
