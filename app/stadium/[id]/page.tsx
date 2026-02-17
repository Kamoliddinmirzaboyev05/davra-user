'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MapPin, Phone, Wifi, ParkingCircle, Coffee, Award } from 'lucide-react';
import Link from 'next/link';

interface Field {
  id: string;
  name: string;
  field_type: string;
  capacity: number;
  price_per_hour: number;
  description: string;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface Stadium {
  id: string;
  name: string;
  description: string;
  location: string;
  phone: string;
  rating: number;
  total_reviews: number;
  amenities: string[];
  fields: Field[];
  reviews: Review[];
}

const amenityIcons: Record<string, React.ReactNode> = {
  'Parking': <ParkingCircle className="h-5 w-5" />,
  'WiFi': <Wifi className="h-5 w-5" />,
  'Cafeteria': <Coffee className="h-5 w-5" />,
  'Shower Facilities': <Award className="h-5 w-5" />,
  'Equipment Rental': <Award className="h-5 w-5" />,
  'VIP Lounge': <Award className="h-5 w-5" />,
  'Training Area': <Award className="h-5 w-5" />,
  'Event Space': <Award className="h-5 w-5" />,
  'Training Programs': <Award className="h-5 w-5" />,
};

export default function StadiumDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const stadiumId = params.id as string;

  const [stadium, setStadium] = useState<Stadium | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  useEffect(() => {
    fetchStadium();
  }, [stadiumId]);

  const fetchStadium = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/stadiums/${stadiumId}`);
      const data = await response.json();

      if (data.success) {
        setStadium(data.data);
        setSelectedField(data.data.fields[0]);
      }
    } catch (error) {
      console.error('Error fetching stadium:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-96 rounded-lg mb-6" />
          <Skeleton className="h-48 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!stadium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Stadium not found</h1>
          <Button onClick={() => router.push('/')} className="bg-emerald-600 hover:bg-emerald-700">
            Back to Stadiums
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium mb-4"
        >
          ← Back
        </button>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden h-64 flex items-center justify-center text-6xl opacity-30">
          ⚽
        </div>

        {/* Header Info */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">{stadium.name}</h1>
          <p className="text-slate-300 text-lg">{stadium.description}</p>

          <div className="flex flex-wrap gap-4">
            {/* Rating */}
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-white font-semibold">{stadium.rating.toFixed(1)}</span>
              <span className="text-slate-400">({stadium.total_reviews} reviews)</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-slate-200">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <span>{stadium.location}</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg text-slate-200">
              <Phone className="h-5 w-5 text-emerald-500" />
              <a href={`tel:${stadium.phone}`} className="hover:text-emerald-400">
                {stadium.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {stadium.amenities.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {stadium.amenities.map((amenity) => (
                <div key={amenity} className="bg-slate-800 rounded-lg p-3 flex items-center gap-2 text-slate-200">
                  <div className="text-emerald-500">{amenityIcons[amenity]}</div>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">Available Fields</h2>
            <div className="space-y-3">
              {stadium.fields.map((field) => (
                <Card
                  key={field.id}
                  onClick={() => setSelectedField(field)}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedField?.id === field.id
                      ? 'bg-emerald-600/20 border-emerald-500 ring-2 ring-emerald-500/50'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{field.name}</h3>
                      <p className="text-sm text-slate-400">{field.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-slate-700 border-slate-600 text-slate-300">
                      {field.field_type}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                    <span className="text-sm text-slate-400">Capacity: {field.capacity} players</span>
                    <span className="text-emerald-400 font-bold">{field.price_per_hour.toLocaleString()} UZS/hr</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-emerald-900/30 to-slate-900 border-emerald-700/50 p-6 sticky top-24 space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Selected Field</p>
                <h3 className="text-xl font-bold text-white">{selectedField?.name}</h3>
              </div>

              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-sm text-slate-400 mb-1">Price per hour</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {selectedField?.price_per_hour.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">UZS</p>
              </div>

              <Button
                onClick={() => router.push(`/booking/${stadiumId}/${selectedField?.id}`)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-6 font-semibold"
              >
                Book Now
              </Button>

              <p className="text-xs text-slate-400 text-center">
                Select your date and time on the next page
              </p>
            </Card>
          </div>
        </div>

        {/* Reviews */}
        {stadium.reviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>
            <div className="space-y-3">
              {stadium.reviews.map((review) => (
                <Card key={review.id} className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-semibold">{review.user}</h4>
                      <p className="text-xs text-slate-400">{review.date}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
