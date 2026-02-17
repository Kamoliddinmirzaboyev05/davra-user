'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Copy, Download } from 'lucide-react';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // In production, fetch booking details from API
    // For MVP, we just show a success message
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="space-y-6 w-full">
          {/* Success Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-900/30 border-2 border-emerald-500 rounded-full mb-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
            </div>
          </div>

          {/* Confirmation Card */}
          <Card className="bg-slate-800 border-slate-700 p-8 space-y-6 text-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
              <p className="text-slate-300">Your soccer field has been successfully booked</p>
            </div>

            {/* Booking ID */}
            <div className="bg-slate-900 rounded-lg p-4 space-y-2">
              <p className="text-sm text-slate-400">Booking ID</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xl font-mono font-bold text-emerald-400">{bookingId}</code>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-300"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-400">Copied to clipboard!</p>}
            </div>

            {/* Details */}
            <div className="bg-slate-900 rounded-lg p-6 text-left space-y-4">
              <h3 className="font-semibold text-white mb-4">Booking Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Date</p>
                  <p className="text-white font-semibold">Feb 17, 2026</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Time</p>
                  <p className="text-white font-semibold">6:00 PM - 7:30 PM</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Location</p>
                  <p className="text-white font-semibold">Central Stadium</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Total Price</p>
                  <p className="text-emerald-400 font-semibold">75,000 UZS</p>
                </div>
              </div>
            </div>

            {/* Info Messages */}
            <div className="space-y-3 text-sm">
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-left">
                <p className="text-blue-200">
                  ✓ Confirmation SMS sent to your phone number
                </p>
              </div>
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-left">
                <p className="text-blue-200">
                  ✓ Please arrive 15 minutes before your booking time
                </p>
              </div>
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-left">
                <p className="text-blue-200">
                  ✓ You can manage your booking from your account
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Back to Home
            </Button>
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-slate-400 border-t border-slate-700 pt-6">
            <p>Questions? Contact us at +998 (71) 200-00-00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
