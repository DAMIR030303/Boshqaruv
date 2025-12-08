# Boshqaruv - Development Guidelines (Muhim Qoidalar)

**⚠️ MUHIM: Bu qoidalar har doim kuzatilishi kerak!**

---

## 🔒 XAVFSIZLIK QOIDALARI

### 1. **Secret Key'lar va Parollar**
- ❌ **HECH QACHON** secret key'larni kodga yozmang
- ✅ Barcha secret'lar `.env` faylida bo'lishi kerak
- ✅ `.env` faylini Git'ga commit qilmang (`.gitignore` da bo'lishi kerak)
- ✅ Production'da barcha default secret'larni o'zgartiring
- ✅ JWT_SECRET kamida 32 belgi bo'lishi kerak

### 2. **Environment Variables**
- ✅ Barcha environment variable'lar `src/config/env.ts` orqali validate qilinadi
- ✅ `.env.example` faylini yangilab turish kerak
- ✅ Production'da barcha required variable'lar to'ldirilgan bo'lishi kerak

### 3. **Authentication va Authorization**
- ✅ Barcha API so'rovlarida token tekshiriladi
- ✅ Password'lar bcrypt bilan hash qilinadi
- ✅ Rate limiting qo'llaniladi (login urinishlari uchun)
- ✅ Session timeout'lar to'g'ri sozlangan bo'lishi kerak

### 4. **Input Validation**
- ✅ Barcha user input'lar Zod bilan validate qilinadi
- ✅ XSS himoyasi - HTML sanitization
- ✅ SQL injection himoyasi (Supabase avtomatik qiladi)

---

## 🎨 KOD SIFATI QOIDALARI

### 1. **TypeScript**
- ✅ `strict: true` mode har doim yoqilgan bo'lishi kerak
- ✅ `any` type ishlatilmasligi kerak (faqat juda zarurat bo'lganda)
- ✅ Barcha funksiyalar va komponentlar type'larga ega bo'lishi kerak
- ✅ Generic type'larni qo'llash

### 2. **ESLint va Prettier**
- ✅ Har bir commit'da `pnpm lint` va `pnpm typecheck` o'tishi kerak
- ✅ Import tartibi `import/order` qoidasiga mos bo'lishi kerak:
  ```typescript
  // 1. Built-in modules
  import path from 'path';
  
  // 2. External libraries
  import React from 'react';
  import { z } from 'zod';
  
  // 3. Internal modules (@/ aliases)
  import { Button } from '@/components/ui/Button';
  
  // 4. Parent imports
  import { useAuth } from '../hooks/useAuth';
  
  // 5. Sibling imports
  import { helper } from './helper';
  
  // 6. Index imports
  import { types } from './';
  ```
- ✅ Har bir guruh orasida bo'sh qator bo'lishi kerak

### 3. **Error Handling**
- ✅ Barcha async operatsiyalar try-catch bilan o'ralgan bo'lishi kerak
- ✅ `console.log` o'rniga `logger.ts` ishlatiladi
- ✅ Production'da console.log'lar o'chiriladi (vite.config.ts)
- ✅ ErrorBoundary barcha komponentlarni o'rab turishi kerak

### 4. **Performance**
- ✅ `React.memo` kerakli joylarda ishlatiladi
- ✅ `useMemo` va `useCallback` qo'llaniladi
- ✅ Lazy loading va code splitting
- ✅ Bundle size monitoring

---

## 📝 KOD YOZISH STANDARTLARI

### 1. **Naming Conventions**
- ✅ Komponentlar: PascalCase (`MobileLogin`)
- ✅ Funksiyalar: camelCase (`handleLogin`)
- ✅ Constant'lar: UPPER_SNAKE_CASE (`DEFAULT_ROUTE`)
- ✅ Type/Interface: PascalCase (`UserProfile`)
- ✅ File nomlari: PascalCase komponentlar uchun, camelCase utility'lar uchun

### 2. **File Structure**
```
src/
├── components/     # React komponentlar
├── hooks/          # Custom hooks
├── services/       # API va business logic
├── utils/          # Utility funksiyalar
├── types/          # TypeScript type'lar
├── config/         # Konfiguratsiya fayllari
├── constants/      # Constant'lar
└── i18n/           # Tarjimalar
```

### 3. **Comments va Documentation**
- ✅ Har bir funksiya va komponent JSDoc bilan dokumentatsiya qilingan
- ✅ Complex logic uchun izohlar qo'shiladi
- ✅ TODO va FIXME comment'lar keyinroq hal qilinishi kerak

### 4. **Git Commit Messages**
- ✅ Conventional Commits format ishlatiladi:
  ```
  feat: add user authentication
  fix: resolve login error
  docs: update README
  refactor: improve error handling
  test: add unit tests for auth
  ```

---

## 🧪 TESTING QOIDALARI

### 1. **Test Coverage**
- ✅ Kamida 70% test coverage
- ✅ Barcha kritik funksiyalar test qilingan
- ✅ Edge case'lar test qilingan

### 2. **Test Types**
- ✅ Unit testlar - har bir utility va service uchun
- ✅ Component testlar - muhim komponentlar uchun
- ✅ Integration testlar - workflow'lar uchun

---

## 🚀 DEPLOYMENT QOIDALARI

### 1. **Pre-deployment Checklist**
- ✅ `pnpm typecheck` - xatolar yo'q
- ✅ `pnpm lint` - lint xatolari yo'q
- ✅ `pnpm test` - barcha testlar o'tadi
- ✅ `.env` fayli to'g'ri sozlangan
- ✅ Production build muvaffaqiyatli

### 2. **Environment Variables**
- ✅ Production'da barcha secret'lar o'zgartirilgan
- ✅ Supabase URL va key to'g'ri
- ✅ JWT_SECRET kuchli va xavfsiz

---

## 📚 KUTUBXONALAR VA TOOLS

### 1. **Asosiy Kutubxonalar**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zod (validation)
- React Hook Form (forms)
- Supabase (backend)

### 2. **Development Tools**
- ESLint (linting)
- Prettier (formatting)
- Husky (Git hooks)
- Vitest (testing)
- TypeScript (type checking)

---

## ⚠️ MUHIM ESLATMALAR

1. **Har doim xavfsizlikni birinchi o'ringa qo'ying**
2. **Kod sifati va tozaligi muhim**
3. **Eng so'ngi best practice'larni qo'llang**
4. **Performance'ni optimallashtiring**
5. **Error handling'ni to'liq qiling**
6. **Testlar yozing**
7. **Dokumentatsiya yaxshi yozing**

---

## 🔄 YANGILANISH JADVALI

Bu qoidalar muntazam yangilanadi va eng so'ngi best practice'larga moslashtiriladi.

**Oxirgi yangilanish:** 2025-01-16

---

**Eslatma:** Bu qoidalar barcha developer'lar tomonidan kuzatilishi kerak. Agar qoida buzilsa, code review'da rad etiladi.

