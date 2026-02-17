import { NextRequest, NextResponse } from 'next/server';

const mockStadiums = {
  '1': {
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
    amenities: ['Parking', 'WiFi', 'Cafeteria', 'Shower Facilities', 'Equipment Rental'],
    fields: [
      { id: '1-1', name: 'Field 1 - Premium', field_type: 'artificial', capacity: 22, price_per_hour: 50000, description: 'Professional-grade synthetic turf' },
      { id: '1-2', name: 'Field 2 - Standard', field_type: 'grass', capacity: 22, price_per_hour: 35000, description: 'Natural grass field' },
    ],
    reviews: [
      { id: 'r1', user: 'Abdurahmon K.', rating: 5, comment: 'Excellent facilities! Great service.', date: '2024-02-10' },
      { id: 'r2', user: 'Yusuf A.', rating: 4, comment: 'Good fields but a bit crowded on weekends.', date: '2024-02-08' },
    ]
  },
  '2': {
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
    amenities: ['Parking', 'Cafeteria', 'Training Area', 'Event Space'],
    fields: [
      { id: '2-1', name: 'Field 1', field_type: 'artificial', capacity: 22, price_per_hour: 45000, description: 'Modern synthetic field' },
      { id: '2-2', name: 'Field 2', field_type: 'artificial', capacity: 22, price_per_hour: 45000, description: 'Modern synthetic field' },
      { id: '2-3', name: 'Field 3', field_type: 'grass', capacity: 22, price_per_hour: 30000, description: 'Natural grass option' },
    ],
    reviews: [
      { id: 'r3', user: 'Dilshod T.', rating: 5, comment: 'Perfect for tournaments!', date: '2024-02-09' },
    ]
  },
  '3': {
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
    amenities: ['Parking', 'Cafeteria'],
    fields: [
      { id: '3-1', name: 'Field 1', field_type: 'grass', capacity: 22, price_per_hour: 25000, description: 'Grass field' },
      { id: '3-2', name: 'Field 2', field_type: 'grass', capacity: 22, price_per_hour: 25000, description: 'Grass field' },
    ],
    reviews: []
  },
  '4': {
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
    amenities: ['Parking', 'WiFi', 'Cafeteria', 'Shower Facilities', 'Equipment Rental', 'VIP Lounge'],
    fields: [
      { id: '4-1', name: 'Main Field', field_type: 'artificial', capacity: 22, price_per_hour: 60000, description: 'Championship-level synthetic field' },
      { id: '4-2', name: 'Practice Field', field_type: 'artificial', capacity: 22, price_per_hour: 50000, description: 'Training field' },
    ],
    reviews: [
      { id: 'r4', user: 'Farid N.', rating: 5, comment: 'Best stadium in the city!', date: '2024-02-11' },
      { id: 'r5', user: 'Sardar B.', rating: 5, comment: 'Amazing experience.', date: '2024-02-07' },
    ]
  },
  '5': {
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
    amenities: ['Parking', 'Cafeteria', 'Training Programs'],
    fields: [
      { id: '5-1', name: 'Field 1', field_type: 'artificial', capacity: 22, price_per_hour: 40000, description: 'Synthetic field' },
      { id: '5-2', name: 'Field 2', field_type: 'mixed', capacity: 22, price_per_hour: 35000, description: 'Mixed surface field' },
    ],
    reviews: []
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stadium = mockStadiums[params.id as keyof typeof mockStadiums];

    if (!stadium) {
      return NextResponse.json(
        { error: 'Stadium not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stadium,
    });
  } catch (error) {
    console.error('Get stadium error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
