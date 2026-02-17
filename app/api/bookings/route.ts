import { NextRequest, NextResponse } from 'next/server';

// Mock bookings storage (in production, use database)
const mockBookings: Record<string, any[]> = {};

export async function POST(request: NextRequest) {
  try {
    const { userId, fieldId, stadiumId, bookingDate, startTime, endTime, totalPrice } = await request.json();

    if (!userId || !fieldId || !bookingDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bookingId = `booking-${Date.now()}`;
    const booking = {
      id: bookingId,
      userId,
      fieldId,
      stadiumId,
      bookingDate,
      startTime,
      endTime,
      status: 'confirmed',
      totalPrice,
      payment_method: 'cash',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (!mockBookings[userId]) {
      mockBookings[userId] = [];
    }
    mockBookings[userId].push(booking);

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const userBookings = mockBookings[userId] || [];

    return NextResponse.json({
      success: true,
      data: userBookings,
      count: userBookings.length,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
