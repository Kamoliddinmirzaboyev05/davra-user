import { NextRequest, NextResponse } from 'next/server';

// Mock stadium data for MVP
const mockStadiums = [
  {
    id: '1',
    name: 'Central Soccer Arena',
    description: 'Premium indoor and outdoor fields in the heart of the city',
    location: 'Amir Timur Avenue, Tashkent',
    city: 'Tashkent',
    latitude: 41.3775,
    longitude: 69.1221,
    phone: '+998 71 233 5555',
    image_url: '/placeholder.jpg',
    rating: 4.8,
    total_reviews: 124,
    fields: [
      { id: '1-1', name: 'Field 1 - Premium', field_type: 'artificial', capacity: 22, price_per_hour: 50000 },
      { id: '1-2', name: 'Field 2 - Standard', field_type: 'grass', capacity: 22, price_per_hour: 35000 },
    ]
  },
  {
    id: '2',
    name: 'North Star Sports Complex',
    description: 'Modern facility with professional-grade fields',
    location: 'Fergona Road, Tashkent',
    city: 'Tashkent',
    latitude: 41.3900,
    longitude: 69.2100,
    phone: '+998 71 244 6666',
    image_url: '/placeholder.jpg',
    rating: 4.6,
    total_reviews: 89,
    fields: [
      { id: '2-1', name: 'Field 1', field_type: 'artificial', capacity: 22, price_per_hour: 45000 },
      { id: '2-2', name: 'Field 2', field_type: 'artificial', capacity: 22, price_per_hour: 45000 },
      { id: '2-3', name: 'Field 3', field_type: 'grass', capacity: 22, price_per_hour: 30000 },
    ]
  },
  {
    id: '3',
    name: 'East Side Sports Hub',
    description: 'Budget-friendly soccer complex with multiple fields',
    location: 'Chilanzar, Tashkent',
    city: 'Tashkent',
    latitude: 41.3600,
    longitude: 69.2500,
    phone: '+998 71 255 7777',
    image_url: '/placeholder.jpg',
    rating: 4.3,
    total_reviews: 67,
    fields: [
      { id: '3-1', name: 'Field 1', field_type: 'grass', capacity: 22, price_per_hour: 25000 },
      { id: '3-2', name: 'Field 2', field_type: 'grass', capacity: 22, price_per_hour: 25000 },
    ]
  },
  {
    id: '4',
    name: 'Downtown Football Stadium',
    description: 'Large capacity stadium perfect for tournaments',
    location: 'Uzbekistan Avenue, Tashkent',
    city: 'Tashkent',
    latitude: 41.3800,
    longitude: 69.1700,
    phone: '+998 71 266 8888',
    image_url: '/placeholder.jpg',
    rating: 4.9,
    total_reviews: 156,
    fields: [
      { id: '4-1', name: 'Main Field', field_type: 'artificial', capacity: 22, price_per_hour: 60000 },
      { id: '4-2', name: 'Practice Field', field_type: 'artificial', capacity: 22, price_per_hour: 50000 },
    ]
  },
  {
    id: '5',
    name: 'West End Training Center',
    description: 'Ideal for training and casual games',
    location: 'Moyqo\'rg\'on, Tashkent',
    city: 'Tashkent',
    latitude: 41.3500,
    longitude: 69.0800,
    phone: '+998 71 277 9999',
    image_url: '/placeholder.jpg',
    rating: 4.4,
    total_reviews: 91,
    fields: [
      { id: '5-1', name: 'Field 1', field_type: 'artificial', capacity: 22, price_per_hour: 40000 },
      { id: '5-2', name: 'Field 2', field_type: 'mixed', capacity: 22, price_per_hour: 35000 },
    ]
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const query = searchParams.get('q');

    let results = mockStadiums;

    // Filter by city if provided
    if (city) {
      results = results.filter(s => s.city.toLowerCase().includes(city.toLowerCase()));
    }

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Get stadiums error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
