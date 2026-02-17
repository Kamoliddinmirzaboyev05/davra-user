'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const phone = localStorage.getItem('phoneNumber');
    setPhoneNumber(phone);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('phoneNumber');
    router.push('/login');
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-emerald-500">⚽</div>
          <h1 className="text-xl font-bold text-white">SoccerHub</h1>
        </div>

        <nav className="flex items-center gap-4">
          {phoneNumber && (
            <>
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{phoneNumber}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </>
          )}
          {!phoneNumber && (
            <Button
              onClick={() => router.push('/login')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
