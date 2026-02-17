'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { StadiumCard } from '@/components/stadiums/stadium-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin } from 'lucide-react';

interface Stadium {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  image_url: string;
  rating: number;
  total_reviews: number;
  fields: Array<{
    id: string;
    name: string;
    field_type: string;
    capacity: number;
    price_per_hour: number;
  }>;
}

export default function HomePage() {
  const router = useRouter();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Tashkent');

  useEffect(() => {
    fetchStadiums();
  }, [selectedCity]);

  const fetchStadiums = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCity) params.append('city', selectedCity);
      if (searchQuery) params.append('q', searchQuery);

      const response = await fetch(`/api/stadiums?${params}`);
      const data = await response.json();

      if (data.success) {
        setStadiums(data.data);
      }
    } catch (error) {
      console.error('Error fetching stadiums:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStadiums();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
            Find Your Perfect Game
          </h1>
          <p className="text-emerald-100 mb-6">Book the best soccer fields in {selectedCity}</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Search stadiums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-slate-900 border-0 placeholder:text-slate-500"
              />
            </div>
            <Button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Tashkent', 'Samarkand', 'Bukhara'].map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCity === city
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Stadiums Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : stadiums.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stadiums.map((stadium) => (
              <StadiumCard
                key={stadium.id}
                stadium={stadium}
                onClick={() => router.push(`/stadium/${stadium.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-1">No stadiums found</h3>
            <p className="text-slate-400">Try searching with different filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
