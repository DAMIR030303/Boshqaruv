# ============================================
# SUPABASE LOYIHANI ULASH - QO'LLANMA
# ============================================

## 📋 Supabase Ma'lumotlarini Olish

Sizning Supabase loyihangiz: `umbmdgiefnxskzouirzf`

### 1. Supabase Dashboard'ga Kiring

URL: https://supabase.com/dashboard/project/umbmdgiefnxskzouirzf

### 2. Project URL va API Keys Olish

1. **Project Settings'ga o'ting:**
   - Dashboard'da chap tarafdagi sidebar'dan "Project Settings" ni bosing
   - Yoki: https://supabase.com/dashboard/project/umbmdgiefnxskzouirzf/settings/api

2. **API Settings'dan quyidagilarni nusxalang:**
   - **Project URL** (masalan: `https://umbmdgiefnxskzouirzf.supabase.co`)
   - **anon/public key** (masalan: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Database Connection String Olish

1. **Database Settings'ga o'ting:**
   - Project Settings > Database
   - Yoki: https://supabase.com/dashboard/project/umbmdgiefnxskzouirzf/settings/database

2. **Connection String'ni nusxalang:**
   - "Connection string" bo'limidan
   - "URI" formatdagi string'ni tanlang
   - Masalan: `postgresql://postgres:[YOUR-PASSWORD]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres`

---

## 🔧 .env Faylini Yaratish

### Qadamlar:

1. **Terminal'da quyidagi buyruqni bajaring:**

```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
cp .env.example .env
```

2. **.env faylini oching va quyidagi qiymatlarni o'zgartiring:**

```env
# ============================================
# Supabase Configuration
# ============================================
VITE_SUPABASE_URL=https://umbmdgiefnxskzouirzf.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# ============================================
# Database Connection (Postgres LSP uchun)
# ============================================
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.umbmdgiefnxskzouirzf.supabase.co:5432/postgres

# ============================================
# Application Configuration
# ============================================
VITE_APP_ENV=development
VITE_APP_TITLE=Boshqaruv

# ============================================
# JWT Secret
# ============================================
VITE_JWT_SECRET=change-this-in-production-minimum-32-characters-long-secret-key

# ============================================
# API Configuration
# ============================================
VITE_API_URL=http://localhost:3000
```

---

## 🔐 Xavfsizlik

### ⚠️ MUHIM:

1. **.env faylini Git'ga commit qilmang!**
   - `.gitignore` da allaqachon qo'shilgan

2. **Parolni to'g'ri kiriting:**
   - `[YOUR-PASSWORD]` o'rniga haqiqiy database parolini yozing
   - Parolni Supabase dashboard'dan olish mumkin

3. **Production'da:**
   - JWT_SECRET ni o'zgartiring
   - Kuchli parollar ishlating

---

## 🚀 Dasturni Ishga Tushirish

### 1. .env Faylini Tekshirish

```bash
# .env fayli mavjudligini tekshirish
ls -la .env

# Mazmunini ko'rish (parolsiz)
cat .env | grep -v PASSWORD
```

### 2. Dasturni Ishga Tushirish

```bash
pnpm dev
```

### 3. Supabase Connection Tekshirish

Dastur ishga tushgandan keyin:
1. Login sahifasiga o'ting
2. Test user bilan login qiling
3. Console'da xatolar yo'qligini tekshiring

---

## 🗄️ Postgres Language Server Sozlash

### .vscode/settings.json

`.vscode/settings.json` faylini yarating:

```json
{
  "postgres-lsp.connectionString": "${DATABASE_URL}",
  "postgres-lsp.enable": true,
  "postgres-lsp.completion.enable": true,
  "postgres-lsp.diagnostics.enable": true,
  
  "[sql]": {
    "editor.defaultFormatter": "supabase.postgres-language-server",
    "editor.formatOnSave": true
  }
}
```

### Tekshirish

1. SQL fayl yarating: `test.sql`
2. Quyidagi kodni yozing:
```sql
SELECT * FROM 
```
3. `Ctrl+Space` bosing
4. Table nomlari ko'rinishi kerak

---

## 📊 Supabase Database Schema

Sizning loyihangizda quyidagi table'lar bo'lishi kerak:

- `users` - Foydalanuvchilar
- `tasks` - Vazifalar
- `employees` - Xodimlar
- `attendance` - Davomat
- `shifts` - Smenalar
- `penalties` - Jarimalar
- `reports` - Hisobotlar
- `kpi` - KPI ma'lumotlari

Agar table'lar yo'q bo'lsa, migration'larni ishga tushiring.

---

## 🔍 Muammolarni Hal Qilish

### Connection xatosi?

**Xato:** `Error: connect ECONNREFUSED`

**Yechim:**
1. Internet connection'ni tekshiring
2. Supabase URL to'g'riligini tekshiring
3. Firewall sozlamalarini tekshiring

### Authentication xatosi?

**Xato:** `Invalid API key`

**Yechim:**
1. Anon key to'g'riligini tekshiring
2. Key'ni qayta nusxalang (bo'sh joylar bo'lmasligi kerak)
3. .env faylini qayta yuklang (dasturni restart qiling)

### Database connection xatosi?

**Xato:** `password authentication failed`

**Yechim:**
1. Database parolini to'g'ri kiritganingizni tekshiring
2. Supabase dashboard'dan parolni reset qiling
3. Connection string'ni qayta nusxalang

---

## ✅ Tekshirish Ro'yxati

- [ ] Supabase dashboard'ga kirdingiz
- [ ] Project URL ni oldingiz
- [ ] Anon key ni oldingiz
- [ ] Database connection string ni oldingiz
- [ ] .env faylini yaratdingiz
- [ ] Barcha qiymatlarni to'g'ri kiritdingiz
- [ ] Dastur ishga tushdi
- [ ] Login ishlayapti
- [ ] Postgres LSP sozlandi
- [ ] SQL autocomplete ishlayapti

---

**Tayyorladi:** AI Assistant  
**Sana:** 2025-12-07  
**Loyiha:** Boshqaruv.uz
