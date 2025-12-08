# Supabase Database Setup - Ikki Usul

## 🎯 Usul 1: Mavjud Script (TEZKOR - Tavsiya etiladi)

Bu usul tezroq va oson. Bizda allaqachon `setup.sql` va `apply-supabase-setup.js` mavjud.

### Qadamlari:

1. **Supabase Dashboard'dan Connection String olish:**
   - https://app.supabase.com → Settings → Database
   - **Connection string** → **URI** → **Direct connection**
   - Connection string'ni nusxalang

2. **Script'ni ishlatish:**

```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv

# Connection string bilan (parol o'rniga sizning parolingizni qo'ying)
node scripts/apply-supabase-setup.js "postgresql://postgres:MJXQq1k0JMvCCwM7@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres"
```

Yoki environment variable orqali:

```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
export POSTGRES_URL_NON_POOLING="postgresql://postgres:MJXQq1k0JMvCCwM7@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres"
node scripts/apply-supabase-setup.js
```

### ✅ Muvaffaqiyatli natija:
```
Supabase tables, Realtime and RLS configured successfully.
```

---

## 🎯 Usul 2: Supabase CLI Migration (Rasmiy usul)

Agar Supabase CLI orqali migration yaratmoqchi bo'lsangiz:

### 1. Supabase CLI o'rnatish:

```bash
# Arch Linux uchun
sudo pacman -S supabase-bin

# Yoki npm/pnpm orqali
pnpm add -D supabase
```

### 2. Project'ni link qilish:

```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
supabase link --project-ref umbmdgiefnxskzouirzf
```

### 3. Migration yaratish:

```bash
# Migration faylini yaratish
supabase migration new initial_schema

# Bu quyidagi faylni yaratadi:
# supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql
```

### 4. Migration faylini to'ldirish:

`supabase/migrations/` katalogida yaratilgan faylga `supabase/setup.sql` dagi barcha SQL kodini ko'chiring.

### 5. Migration'ni ishga tushirish:

```bash
supabase db push
```

---

## 📊 Qaysi usulni tanlash?

| Xususiyat | Usul 1 (Script) | Usul 2 (CLI) |
|-----------|----------------|--------------|
| Tezlik | ⚡ Tez | 🐌 Sekinroq |
| O'rnatish | ✅ Hech narsa kerak emas | ❌ CLI o'rnatish kerak |
| Migration tracking | ❌ Yo'q | ✅ Ha (Supabase Dashboard'da ko'rinadi) |
| Tavsiya | ✅ **Tavsiya etiladi** | Agar migration tracking kerak bo'lsa |

---

## ⚠️ MUHIM ESKATMA

Parolni xavfsiz saqlang! `.env` faylida saqlang va Git'ga commit qilmang.

Connection string format:
```
postgresql://postgres:[PAROL]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres
```

---

## 🔍 Tekshirish

Setup muvaffaqiyatli bo'lgandan keyin:

1. Supabase Dashboard → **Table Editor** ga o'ting
2. Quyidagi jadvallar yaratilganini ko'ring:
   - ✅ `kpi`
   - ✅ `tasks`
   - ✅ `attendance`
   - ✅ `shifts`
   - ✅ `penalties`
   - ✅ `reports`
   - ✅ `marketing_tasks`
   - ✅ `instagram_posts`
   - ✅ `video_projects`
   - ✅ `marketing_kpi`
   - ✅ `content_monitoring`
   - ✅ `ai_content_logs`

3. **Authentication** → **Policies** ga o'tib, RLS policy'larni tekshiring

