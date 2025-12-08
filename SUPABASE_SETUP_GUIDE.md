# Supabase Setup Yo'riqnomasi

## ✅ Bajarilgan ishlar

1. ✅ `.env` fayli yaratildi va Supabase sozlamalari o'rnatildi
2. ✅ `.env.example` fayli yaratildi
3. ✅ Supabase client kodi tekshirildi va to'g'ri ishlaydi

## 📋 Supabase Database Setup

Ma'lumotlar bazasini sozlash uchun quyidagi qadamlarni bajaring:

### 1. Supabase Dashboard'dan Postgres Connection String olish

1. [Supabase Dashboard](https://app.supabase.com) ga kiring
2. Loyihangizni tanlang: `umbmdgiefnxskzouirzf`
3. **Settings** → **Database** ga o'ting
4. **Connection string** bo'limida **URI** ni tanlang
5. **Connection pooling** o'rniga **Direct connection** ni tanlang
6. Connection string'ni nusxalang (quyidagi formatda bo'ladi):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres
   ```

### 2. Database Setup Script'ni ishlatish

**MUHIM:** Script'ni ishlatishdan oldin, `Boshqaruv/` katalogida ekanligingizni tekshiring:

```bash
# To'g'ri katalogga o'tish
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv

# Postgres connection string bilan
node scripts/apply-supabase-setup.js "postgresql://postgres:[YOUR-PASSWORD]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres"
```

Yoki environment variable orqali:

```bash
# To'g'ri katalogga o'tish
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv

# Environment variable o'rnatish
export POSTGRES_URL_NON_POOLING="postgresql://postgres:[YOUR-PASSWORD]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres"

# Script'ni ishlatish
node scripts/apply-supabase-setup.js
```

**Eslatma:** Agar xato bo'lsa, quyidagilarni tekshiring:
- ✅ `Boshqaruv/` katalogida ekanligingizni (`pwd` buyrug'i bilan)
- ✅ `node_modules/pg` paketi o'rnatilganligini (`pnpm install` bilan)
- ✅ Connection string'da parol to'g'ri ekanligini

### 3. Yaratiladigan jadvallar

Setup script quyidagi jadvallarni yaratadi:

- ✅ `kpi` - KPI ma'lumotlari
- ✅ `tasks` - Vazifalar
- ✅ `attendance` - Davomat
- ✅ `shifts` - Smenalar
- ✅ `penalties` - Jarimalar
- ✅ `reports` - Hisobotlar
- ✅ `marketing_tasks` - Marketing vazifalari
- ✅ `instagram_posts` - Instagram postlari
- ✅ `video_projects` - Video loyihalar
- ✅ `marketing_kpi` - Marketing KPI
- ✅ `content_monitoring` - Kontent monitoring
- ✅ `ai_content_logs` - AI kontent loglari

### 4. Row Level Security (RLS) va Realtime

Barcha jadvallar uchun:
- ✅ Row Level Security (RLS) yoqilgan
- ✅ Realtime yangilanishlar yoqilgan
- ✅ Authenticated foydalanuvchilar uchun policy'lar yaratilgan

## 🔍 Tekshirish

Setup muvaffaqiyatli bo'lganini tekshirish uchun:

1. Supabase Dashboard → **Table Editor** ga o'ting
2. Yaratilgan jadvallarni ko'ring
3. **Authentication** → **Policies** ga o'tib, RLS policy'larni tekshiring

## 🚀 Dasturni ishga tushirish

Environment variable'lar o'rnatilgandan keyin:

```bash
# Dependencies o'rnatish
pnpm install

# Development server'ni ishga tushirish
pnpm dev
```

Dastur avtomatik ravishda `.env` faylidan Supabase sozlamalarini o'qiydi.

## ⚠️ Xavfsizlik eslatmalari

1. `.env` faylini **hech qachon** Git'ga commit qilmang (`.gitignore` da mavjud)
2. Production'da `VITE_JWT_SECRET` ni o'zgartiring
3. Supabase anon key public bo'lsa ham, RLS policy'lar xavfsizlikni ta'minlaydi

## 📝 Keyingi qadamlar

1. Database setup script'ni ishlatish (yuqoridagi qadam 2)
2. Dasturni ishga tushirish va test qilish
3. Authentication sozlamalarini tekshirish (agar kerak bo'lsa)

