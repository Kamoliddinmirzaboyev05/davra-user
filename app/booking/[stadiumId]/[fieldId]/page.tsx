'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Calendar, Clock } from 'lucide-react';
import { generateTimeSlots, calculateDuration, calculatePrice, isTimeSlotValid } from '@/lib/time-slots';

const FIELD_PRICES: Record<string, number> = {
  '1-1': 50000,
  '1-2': 35000,
  '2-1': 45000,
  '2-2': 45000,
  '2-3': 30000,
  '3-1': 25000,
  '3-2': 25000,
  '4-1': 60000,
  '4-2': 50000,
  '5-1': 40000,
  '5-2': 35000,
};

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const stadiumId = params.stadiumId as string;
  const fieldId = params.fieldId as string;

  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  const timeSlots = generateTimeSlots();
  const pricePerHour = FIELD_PRICES[fieldId] || 40000;
  const duration = startTime && endTime ? calculateDuration(startTime, endTime) : 0;
  const totalPrice = calculatePrice(pricePerHour, duration);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (!id) {
      router.push('/login');
    } else {
      setUserId(id);
    }

    // Set today as default date
    const today = new Date().toISOString().split('T')[0];
    setBookingDate(today);
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!bookingDate || !startTime || !endTime || !userId) {
      setError('Please fill in all fields');
      return;
    }

    if (!isTimeSlotValid(startTime, endTime)) {
      setError('End time must be after start time');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          fieldId,
          stadiumId,
          bookingDate,
          startTime,
          endTime,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create booking');
        return;
      }

      // Redirect to confirmation
      router.push(`/booking-confirmation/${data.data.id}`);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mb-6"
        >
          ← Back
        </button>

        <div className="space-y-6">
          {/* Booking Details */}
          <Card className="bg-slate-800 border-slate-700 p-6 space-y-6">
            <h1 className="text-2xl font-bold text-white">Book Your Game</h1>

            <form onSubmit={handleBook} className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Booking Date
                </label>
                <Input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={today}
                  disabled={isLoading}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Start Time
                  </label>
                  <Select value={startTime} onValueChange={setStartTime} disabled={isLoading}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    End Time
                  </label>
                  <Select value={endTime} onValueChange={setEndTime} disabled={isLoading || !startTime}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {timeSlots
                        .filter((time) => !startTime || time > startTime)
                        .map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !bookingDate || !startTime || !endTime}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </form>
          </Card>

          {/* Price Summary */}
          {startTime && endTime && (
            <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900 border-emerald-700/50 p-6 space-y-3">
              <h2 className="text-lg font-bold text-white">Price Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>Price per hour</span>
                  <span>{pricePerHour.toLocaleString()} UZS</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Duration</span>
                  <span>{duration} hour{duration !== 1 ? 's' : ''}</span>
                </div>
              </div>

              <div className="border-t border-emerald-700/30 pt-3 flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <span className="text-3xl font-bold text-emerald-400">
                  {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-400">UZS</p>
            </Card>
          )}

          {/* Info Card */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <p className="text-sm text-slate-300">
              <span className="font-semibold">Note:</span> After booking, you'll receive a confirmation SMS with all details. Please arrive 15 minutes early.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
