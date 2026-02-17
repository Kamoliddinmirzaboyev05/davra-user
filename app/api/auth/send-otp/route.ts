import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  generateOTP, 
  validatePhoneNumber, 
  normalizePhoneNumber, 
  sendMockSMS,
  isTestPhoneNumber,
  getTestOTP 
} from '@/lib/otp';
import { mockStorage } from '@/lib/mock-storage';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    
    // Use test OTP for test phone numbers, otherwise generate random
    const otp = isTestPhoneNumber(normalizedPhone) 
      ? getTestOTP(normalizedPhone)! 
      : generateOTP();
    
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const useSupabase = supabaseUrl && supabaseKey && 
                        !supabaseUrl.includes('your-project') && 
                        !supabaseKey.includes('your-service-role-key');

    if (useSupabase) {
      // Use Supabase
      const supabase = createClient(supabaseUrl!, supabaseKey!);
      
      // Expire old OTP codes for this phone
      await supabase
        .from('otp_sessions')
        .update({ is_verified: false })
        .eq('phone_number', normalizedPhone)
        .lt('expires_at', new Date().toISOString());

      // Create new OTP session
      const { data, error } = await supabase
        .from('otp_sessions')
        .insert({
          phone_number: normalizedPhone,
          otp_code: otp,
          is_verified: false,
          attempts: 0,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to generate OTP' },
          { status: 500 }
        );
      }
    } else {
      // Use mock storage
      console.log('📦 Using mock storage (Supabase not configured)');
      mockStorage.createOTPSession(normalizedPhone, otp);
    }

    // Send mock SMS
    await sendMockSMS(normalizedPhone, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development mode, return OTP for testing (remove in production!)
      ...(process.env.NODE_ENV === 'development' && { 
        otp,
        isTestNumber: isTestPhoneNumber(normalizedPhone)
      }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
