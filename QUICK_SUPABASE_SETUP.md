# Tezkor Supabase Setup

## ⚠️ MUHIM: To'g'ri katalog

Script'ni ishlatishdan oldin, **Boshqaruv/** katalogida ekanligingizni tekshiring:

```bash
# Katalogni tekshirish
pwd
# Natija: /home/damir/Cursor/Boshqaruv.uz/Boshqaruv bo'lishi kerak

# Agar noto'g'ri katalogda bo'lsangiz:
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
```

## 🚀 Setup qadamlari

### 1. Supabase Dashboard'dan Connection String olish

1. https://app.supabase.com ga kiring
2. `umbmdgiefnxskzouirzf` loyihasini tanlang
3. **Settings** → **Database**
4. **Connection string** → **URI** → **Direct connection**
5. Connection string'ni nusxalang (parol bilan)

### 2. Script'ni ishlatish

```bash
# To'g'ri katalogga o'tish
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv

# Connection string bilan ishlatish
node scripts/apply-supabase-setup.js "postgresql://postgres:[PAROL]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres"
```

Yoki environment variable orqali:

```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
export POSTGRES_URL_NON_POOLING="postgresql://postgres:[PAROL]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres"
node scripts/apply-supabase-setup.js
```

## ✅ Muvaffaqiyatli natija

Agar hamma narsa to'g'ri bo'lsa, quyidagi xabar ko'rinadi:

```
Supabase tables, Realtime and RLS configured successfully.
```

## ❌ Xatolar va yechimlar

### Xato: `Cannot find module`
**Sabab:** Noto'g'ri katalogdan buyruq ishlatilgan
**Yechim:** `cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv` bilan to'g'ri katalogga o'ting

### Xato: `Missing Postgres connection string`
**Sabab:** Connection string berilmagan
**Yechim:** Connection string'ni argument sifatida yoki environment variable orqali o'rnating

### Xato: `password authentication failed`
**Sabab:** Noto'g'ri parol
**Yechim:** Supabase Dashboard'dan to'g'ri parolni oling

## 📋 Keyingi qadamlar

Setup muvaffaqiyatli bo'lgandan keyin:

1. Supabase Dashboard → **Table Editor** da jadvallarni ko'ring
2. Dasturni ishga tushiring: `pnpm dev`
3. Dastur Supabase'ga ulanadi va ma'lumotlarni o'qiy boshlaydi

