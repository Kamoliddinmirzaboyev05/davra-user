/**
 * In-memory mock storage for development without Supabase
 */

interface OTPSession {
  id: string;
  phone_number: string;
  otp_code: string;
  is_verified: boolean;
  attempts: number;
  created_at: Date;
  expires_at: Date;
}

interface User {
  id: string;
  phone_number: string;
  full_name?: string;
  created_at: Date;
}

class MockStorage {
  private otpSessions: Map<string, OTPSession> = new Map();
  private users: Map<string, User> = new Map();

  // OTP Sessions
  createOTPSession(phoneNumber: string, otpCode: string): OTPSession {
    const id = Math.random().toString(36).substring(7);
    const session: OTPSession = {
      id,
      phone_number: phoneNumber,
      otp_code: otpCode,
      is_verified: false,
      attempts: 0,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    };
    
    this.otpSessions.set(phoneNumber, session);
    return session;
  }

  getOTPSession(phoneNumber: string): OTPSession | null {
    const session = this.otpSessions.get(phoneNumber);
    if (!session) return null;
    
    // Check if expired
    if (new Date() > session.expires_at) {
      this.otpSessions.delete(phoneNumber);
      return null;
    }
    
    return session;
  }

  updateOTPSession(phoneNumber: string, updates: Partial<OTPSession>): boolean {
    const session = this.otpSessions.get(phoneNumber);
    if (!session) return false;
    
    Object.assign(session, updates);
    return true;
  }

  // Users
  createUser(phoneNumber: string): User {
    const id = Math.random().toString(36).substring(7);
    const user: User = {
      id,
      phone_number: phoneNumber,
      created_at: new Date(),
    };
    
    this.users.set(phoneNumber, user);
    return user;
  }

  getUser(phoneNumber: string): User | null {
    return this.users.get(phoneNumber) || null;
  }

  getUserById(id: string): User | null {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }
}

// Singleton instance
export const mockStorage = new MockStorage();
