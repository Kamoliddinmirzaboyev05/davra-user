import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { normalizePhoneNumber } from '@/lib/otp';
import { mockStorage } from '@/lib/mock-storage';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const useSupabase = supabaseUrl && supabaseKey && 
                        !supabaseUrl.includes('your-project') && 
                        !supabaseKey.includes('your-service-role-key');

    let userId: string;

    if (useSupabase) {
      // Use Supabase
      const supabase = createClient(supabaseUrl!, supabaseKey!);

      // Find the most recent OTP session for this phone
      const { data: otpSession, error: fetchError } = await supabase
        .from('otp_sessions')
        .select('*')
        .eq('phone_number', normalizedPhone)
        .eq('is_verified', false)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpSession) {
        return NextResponse.json(
          { error: 'OTP expired or not found' },
          { status: 400 }
        );
      }

      // Check attempts
      if (otpSession.attempts >= 3) {
        return NextResponse.json(
          { error: 'Too many attempts. Please request a new OTP' },
          { status: 400 }
        );
      }

      // Verify OTP code
      if (otpSession.otp_code !== otp) {
        // Increment attempts
        await supabase
          .from('otp_sessions')
          .update({ attempts: otpSession.attempts + 1 })
          .eq('id', otpSession.id);

        return NextResponse.json(
          { error: 'Invalid OTP code' },
          { status: 400 }
        );
      }

      // Mark OTP as verified
      await supabase
        .from('otp_sessions')
        .update({ is_verified: true })
        .eq('id', otpSession.id);

      // Check if user exists or create them
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', normalizedPhone)
        .single();

      if (!userData) {
        // User doesn't exist - create with anonymous auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          phone: normalizedPhone,
          email: `${normalizedPhone.replace('+', '')}@temp.soccer`,
          password: Math.random().toString(36),
          user_metadata: { phone_verified: true },
        });

        if (authError || !authData.user) {
          console.error('Auth error:', authError);
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          );
        }

        userId = authData.user.id;

        // Create user profile
        await supabase
          .from('users')
          .insert({
            id: userId,
            phone_number: normalizedPhone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      } else {
        userId = userData.id;
      }
    } else {
      // Use mock storage
      console.log('📦 Using mock storage (Supabase not configured)');
      
      const otpSession = mockStorage.getOTPSession(normalizedPhone);
      
      if (!otpSession) {
        return NextResponse.json(
          { error: 'OTP expired or not found' },
          { status: 400 }
        );
      }

      // Check attempts
      if (otpSession.attempts >= 3) {
        return NextResponse.json(
          { error: 'Too many attempts. Please request a new OTP' },
          { status: 400 }
        );
      }

      // Verify OTP code
      if (otpSession.otp_code !== otp) {
        mockStorage.updateOTPSession(normalizedPhone, {
          attempts: otpSession.attempts + 1
        });

        return NextResponse.json(
          { error: 'Invalid OTP code' },
          { status: 400 }
        );
      }

      // Mark OTP as verified
      mockStorage.updateOTPSession(normalizedPhone, { is_verified: true });

      // Check if user exists or create them
      let user = mockStorage.getUser(normalizedPhone);
      if (!user) {
        user = mockStorage.createUser(normalizedPhone);
      }
      
      userId = user.id;
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      userId,
      phoneNumber: normalizedPhone,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
