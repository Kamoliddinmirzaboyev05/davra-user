import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('[v0] Starting database setup...');

    // Create users table
    const { error: usersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          phone_number VARCHAR(20) UNIQUE,
          full_name VARCHAR(255),
          email VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
      `
    });

    if (usersError && !usersError.message.includes('already exists')) {
      console.error('[v0] Error creating users table:', usersError);
    } else {
      console.log('[v0] Users table ready');
    }

    // Create stadiums table
    const { error: stadiumsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS stadiums (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          location VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          phone VARCHAR(20),
          image_url VARCHAR(500),
          rating DECIMAL(3, 2) DEFAULT 4.5,
          total_reviews INT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
      `
    });

    if (stadiumsError && !stadiumsError.message.includes('already exists')) {
      console.error('[v0] Error creating stadiums table:', stadiumsError);
    } else {
      console.log('[v0] Stadiums table ready');
    }

    // Create fields table
    const { error: fieldsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS fields (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          stadium_id UUID NOT NULL REFERENCES stadiums(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          field_type VARCHAR(50) NOT NULL,
          capacity INT DEFAULT 22,
          price_per_hour DECIMAL(10, 2) NOT NULL,
          image_url VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
      `
    });

    if (fieldsError && !fieldsError.message.includes('already exists')) {
      console.error('[v0] Error creating fields table:', fieldsError);
    } else {
      console.log('[v0] Fields table ready');
    }

    // Create bookings table
    const { error: bookingsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
          booking_date DATE NOT NULL,
          start_time TIME NOT NULL,
          end_time TIME NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          total_price DECIMAL(10, 2),
          payment_method VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      `
    });

    if (bookingsError && !bookingsError.message.includes('already exists')) {
      console.error('[v0] Error creating bookings table:', bookingsError);
    } else {
      console.log('[v0] Bookings table ready');
    }

    // Create reviews table
    const { error: reviewsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          stadium_id UUID NOT NULL REFERENCES stadiums(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
          rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
      `
    });

    if (reviewsError && !reviewsError.message.includes('already exists')) {
      console.error('[v0] Error creating reviews table:', reviewsError);
    } else {
      console.log('[v0] Reviews table ready');
    }

    // Create favorites table
    const { error: favoritesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          stadium_id UUID NOT NULL REFERENCES stadiums(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, stadium_id)
        );
        ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
      `
    });

    if (favoritesError && !favoritesError.message.includes('already exists')) {
      console.error('[v0] Error creating favorites table:', favoritesError);
    } else {
      console.log('[v0] Favorites table ready');
    }

    // Create OTP sessions table
    const { error: otpError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS otp_sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          phone_number VARCHAR(20) NOT NULL,
          otp_code VARCHAR(6) NOT NULL,
          is_verified BOOLEAN DEFAULT false,
          attempts INT DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes')
        );
        ALTER TABLE otp_sessions ENABLE ROW LEVEL SECURITY;
      `
    });

    if (otpError && !otpError.message.includes('already exists')) {
      console.error('[v0] Error creating OTP table:', otpError);
    } else {
      console.log('[v0] OTP sessions table ready');
    }

    console.log('[v0] Database setup complete!');
  } catch (error) {
    console.error('[v0] Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
