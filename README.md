# Futbol Maydonlari Band Qilish Platformasi

Next.js va Supabase asosida qurilgan futbol maydonlarini band qilish tizimi.

## Xususiyatlar

- 📱 SMS OTP autentifikatsiya (mock)
- 🏟️ Stadion va maydonlarni ko'rish
- 📅 Vaqt slotlarini tanlash va band qilish
- 👤 Foydalanuvchi profili
- ⭐ Stadionlarni baholash va sevimlilar

## O'rnatish

1. Loyihani klonlash:
```bash
git clone <repository-url>
cd <project-folder>
```

2. Paketlarni o'rnatish:
```bash
npm install
# yoki
pnpm install
```

3. Environment o'zgaruvchilarini sozlash:

`.env.local` faylini yarating va quyidagilarni qo'shing:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Supabase ma'lumotlar bazasini sozlash:

`scripts/01-create-tables.sql` faylini Supabase SQL editorida ishga tushiring.

5. Development serverni ishga tushirish:
```bash
npm run dev
```

Brauzerda `http://localhost:3000` ochiladi.

## SMS OTP Mock Tizimi

Development rejimida SMS OTP mock qilingan. Test uchun quyidagi raqamlardan foydalaning:

- **+998901234567** → OTP: `111111`
- **+998909999999** → OTP: `999999`
- **+998900000000** → OTP: `123456`

Boshqa raqamlar uchun tasodifiy OTP generatsiya qilinadi va console da ko'rsatiladi.

## Texnologiyalar

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: SMS OTP (mock)

## Loyiha Strukturasi

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Autentifikatsiya
│   │   ├── bookings/     # Band qilishlar
│   │   └── stadiums/     # Stadionlar
│   ├── booking/          # Band qilish sahifalari
│   ├── login/            # Login sahifasi
│   └── stadium/          # Stadion detallari
├── components/            # React komponentlar
│   ├── auth/             # Auth komponentlari
│   ├── stadiums/         # Stadion komponentlari
│   └── ui/               # UI komponentlari
├── lib/                   # Utility funksiyalar
│   ├── otp.ts            # OTP utilities
│   └── time-slots.ts     # Vaqt slot utilities
└── scripts/              # Database skriptlar
```

## Production uchun

Production muhitida:
1. Haqiqiy SMS provider (Twilio, Vonage) integratsiya qiling
2. `lib/otp.ts` da `sendMockSMS` ni haqiqiy SMS yuborish bilan almashtiring
3. Environment o'zgaruvchilarini production serverda sozlang
4. Debug OTP ni API response dan olib tashlang

## Litsenziya

MIT
