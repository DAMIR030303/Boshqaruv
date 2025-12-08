# Supabase Connection Muammosi va Yechimi

## ❌ Xato: `ENETUNREACH` (IPv6 muammosi)

Connection string IPv6 manzilga ulanmoqchi bo'lyapti, lekin tarmoq IPv6'ni qo'llab-quvvatlamayapti.

## ✅ Yechimlar

### Yechim 1: Supabase Dashboard'dan to'g'ri Connection String olish

1. **Supabase Dashboard** ga kiring: https://app.supabase.com
2. **Settings** → **Database** ga o'ting
3. **Connection string** bo'limida:
   - **URI** ni tanlang
   - **Direct connection** ni tanlang (pooling emas)
   - **IPv4** yoki **IPv6** variantini tanlang
   - Connection string'ni nusxalang

### Yechim 2: Connection String'ni IPv4 ga o'zgartirish

Agar connection string IPv6 manzilni o'z ichiga olgan bo'lsa, quyidagicha o'zgartiring:

**IPv6 format (ishlamaydi):**
```
postgresql://postgres:PAROL@[2406:da1a:6b0:f602:9a99:defe:1a7a:fa4f]:5432/postgres
```

**IPv4 format (ishlaydi):**
```
postgresql://postgres:PAROL@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres
```

### Yechim 3: Supabase SQL Editor orqali

Agar connection string ishlamasa, Supabase Dashboard'dagi **SQL Editor** dan foydalaning:

1. Supabase Dashboard → **SQL Editor**
2. `supabase/setup.sql` faylini oching
3. SQL kodini nusxalab, SQL Editor'ga yopishtiring
4. **Run** tugmasini bosing

Bu usul connection string muammosini hal qiladi.

## 🚀 Tezkor Yechim (SQL Editor)

1. https://app.supabase.com → **SQL Editor**
2. `supabase/setup.sql` faylini oching
3. Barcha SQL kodini nusxalab, SQL Editor'ga yopishtiring
4. **Run** tugmasini bosing

Bu eng oson va ishonchli usul!

## 📝 Keyingi qadamlar

Setup muvaffaqiyatli bo'lgandan keyin:

1. **Table Editor** da jadvallarni ko'ring
2. **Authentication** → **Policies** da RLS policy'larni tekshiring
3. Dasturni ishga tushiring: `pnpm dev`

