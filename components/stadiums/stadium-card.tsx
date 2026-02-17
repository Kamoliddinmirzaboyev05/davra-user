'use client';

import { Star, MapPin, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StadiumCardProps {
  stadium: {
    id: string;
    name: string;
    description: string;
    location: string;
    image_url: string;
    rating: number;
    total_reviews: number;
    fields: Array<{
      price_per_hour: number;
    }>;
  };
  onClick: () => void;
}

export function StadiumCard({ stadium, onClick }: StadiumCardProps) {
  const minPrice = Math.min(...stadium.fields.map(f => f.price_per_hour));
  const maxPrice = Math.max(...stadium.fields.map(f => f.price_per_hour));

  return (
    <Card
      onClick={onClick}
      className="overflow-hidden hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer transition-all group bg-slate-800 border-slate-700"
    >
      {/* Image */}
      <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20 group-hover:scale-110 transition-transform">
          ⚽
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {stadium.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-1">{stadium.description}</p>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-500" />
          <span className="line-clamp-1">{stadium.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-white">{stadium.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-slate-400">({stadium.total_reviews} reviews)</span>
        </div>

        {/* Price and Fields */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <div className="space-y-1">
            <p className="text-xs text-slate-400">from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-emerald-400">{minPrice.toLocaleString()}</span>
              <span className="text-xs text-slate-400">UZS/hr</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-slate-700 border-slate-600 text-slate-300">
            {stadium.fields.length} fields
          </Badge>
        </div>
      </div>
    </Card>
  );
}
