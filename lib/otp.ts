/**
 * OTP (One-Time Password) utilities for mock SMS authentication
 * This is a development/testing implementation
 */

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function validatePhoneNumber(phone: string): boolean {
  // Accept Uzbek phone numbers and other formats
  const phoneRegex = /^(?:\+998|0)?[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
}

export function normalizePhoneNumber(phone: string): string {
  // Normalize to +998XXXXXXXXX format for Uzbekistan
  let cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('998')) {
    cleaned = cleaned;
  } else if (cleaned.startsWith('0')) {
    cleaned = '998' + cleaned.slice(1);
  } else if (cleaned.length === 9) {
    cleaned = '998' + cleaned;
  }
  
  return '+' + cleaned;
}

/**
 * Mock SMS sending - in production, integrate with Twilio or similar
 * For development, we log to console and store in memory
 */
export async function sendMockSMS(phoneNumber: string, otp: string): Promise<boolean> {
  console.log('\n' + '='.repeat(60));
  console.log('📱 MOCK SMS XABARNOMA');
  console.log('='.repeat(60));
  console.log(`Qabul qiluvchi: ${phoneNumber}`);
  console.log(`Tasdiqlash kodi: ${otp}`);
  console.log(`Vaqt: ${new Date().toLocaleString('uz-UZ')}`);
  console.log('='.repeat(60) + '\n');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
}

/**
 * Test phone numbers that always use the same OTP for easy testing
 */
export const TEST_PHONE_NUMBERS: Record<string, string> = {
  '+998901234567': '111111',
  '+998909999999': '999999',
  '+998900000000': '123456',
};

/**
 * Check if phone number is a test number
 */
export function isTestPhoneNumber(phoneNumber: string): boolean {
  return phoneNumber in TEST_PHONE_NUMBERS;
}

/**
 * Get OTP for test phone number
 */
export function getTestOTP(phoneNumber: string): string | null {
  return TEST_PHONE_NUMBERS[phoneNumber] || null;
}
