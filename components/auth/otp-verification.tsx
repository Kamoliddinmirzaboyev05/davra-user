'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onChangePhone: () => void;
  isLoading: boolean;
  error: string;
  debugOTP?: string;
}

export function OTPVerification({
  phoneNumber,
  onVerify,
  onChangePhone,
  isLoading,
  error,
  debugOTP,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (otp.length === 6) {
      await onVerify(otp);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-slate-300 mb-1">Verification code sent to:</p>
        <p className="text-lg font-semibold text-white">{phoneNumber}</p>
        <button
          onClick={onChangePhone}
          className="text-xs text-emerald-400 hover:text-emerald-300 mt-2 font-medium"
        >
          Use different number
        </button>
      </div>

      <div>
        <label htmlFor="otp" className="block text-sm font-medium text-white mb-3">
          Enter verification code
        </label>
        <div className="flex justify-center gap-2">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="w-12 h-12">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={otp[idx] || ''}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 1) {
                    const newOtp = otp.split('');
                    newOtp[idx] = val;
                    setOtp(newOtp.join(''));
                    
                    // Auto-focus next input
                    if (val && idx < 5) {
                      const nextInput = e.target.parentElement?.nextElementSibling?.querySelector('input');
                      nextInput?.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  // Handle backspace
                  if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                    const prevInput = e.target.parentElement?.previousElementSibling?.querySelector('input');
                    prevInput?.focus();
                  }
                }}
                disabled={isLoading}
                className="w-full h-full text-center text-2xl font-bold bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
              />
            </div>
          ))}
        </div>
      </div>

      {debugOTP && (
        <div className="p-3 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-200 text-sm">
          <p className="font-semibold">Debug: OTP is {debugOTP}</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">
          Code expires in: <span className="font-semibold text-white">{formatTime(timeLeft)}</span>
        </span>
      </div>

      <Button
        onClick={handleVerify}
        disabled={isLoading || otp.length !== 6 || timeLeft === 0}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        {isLoading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Verifying...
          </>
        ) : (
          'Verify & Continue'
        )}
      </Button>

      <p className="text-xs text-slate-400 text-center">
        Didn't receive the code? Check your phone or try again shortly.
      </p>
    </div>
  );
}
