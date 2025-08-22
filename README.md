# Boshqaruv - Mobil Boshqaruv Tizimi

## 📱 Dastur Haqida

**Boshqaruv** - bu xodimlar, vazifalar, davomat va marketing jarayonlarini boshqarish uchun mo'ljallangan zamonaviy mobil ilova. Ilova O'zbek tilida yaratilgan va barcha turdagi qurilmalarda ishlaydi.

## ✨ Asosiy Xususiyatlar

- 🔐 **Role-based Authentication** - 4 xil foydalanuvchi roli
- 📊 **Real-time KPI Monitoring** - Davomat, vazifalar va jarimalar statistikasi
- 🎨 **Dark/Light Theme** - Foydalanuvchi xohishiga ko'ra tema o'zgartirish
- 📱 **Mobile-First Design** - Barcha qurilmalarda optimallashtirilgan
- 🌐 **O'zbek tili** - To'liq o'zbek tilida interfeys
- ⚡ **Performance Optimized** - Tez ishlash va samaradorlik

## 👥 Foydalanuvchi Rollari

### 1. Administrator (admin/admin123)
- **F.I.O:** Alisher Fayzullayev
- **Ruxsatlar:** To'liq dasturga kirish
- **Interface:** Admin paneli (barcha funksiyalar)

### 2. Manager (manager/manager123)  
- **F.I.O:** Nargiza Karimova
- **Ruxsatlar:** Xodimlar va vazifalarni boshqarish
- **Interface:** Manager paneli (cheklangan admin funksiyalar)

### 3. Marketing Boshqaruvchisi (marketolog/marketing123)
- **F.I.O:** Shaxriddin Adizov Sherali o'g'li
- **Ruxsatlar:** Marketing vazifalarini boshqarish
- **Interface:** Maxsus marketing paneli
- **Kunlik vazifalar:**
  - 15-18 ta Instagram post yaratish
  - 10-15 ta video montaj qilish
  - Kontent monitoring va tahlil
  - AI yordamida kontent ishlab chiqish

### 4. Oddiy Xodim (user/user123)
- **F.I.O:** Javohir Tursunov  
- **Ruxsatlar:** Shaxsiy vazifalar va davomat
- **Interface:** Soddalashtirilgan employee paneli

## 🚀 Texnik Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Framer Motion (motion/react)
- **Forms:** React Hook Form + Zod
- **Notifications:** Sonner
- **Build Tool:** Vite

### Development Tools
- **Linting:** ESLint + Prettier
- **Type checking:** TypeScript strict mode
- **Code splitting:** Lazy loading
- **Performance:** Custom hooks for monitoring

## 📁 Loyiha Strukturasi

```
src/
├── components/
│   ├── mobile/           # Mobile komponentlar
│   │   ├── MobileDashboard.tsx
│   │   ├── MobileEmployees.tsx
│   │   ├── MobileTasks.tsx
│   │   ├── MobileAttendance.tsx
│   │   ├── EmployeeDashboard.tsx
│   │   └── ...
│   ├── ErrorBoundary.tsx # Xatoliklar boshqaruvi
│   └── LoadingFallback.tsx
├── constants/
│   └── app.ts           # Ilova konstantalari
├── hooks/
│   ├── useAsyncOperation.ts
│   └── usePerformanceMonitor.ts
├── types/
│   └── index.ts         # TypeScript tiplari
├── utils/
│   ├── auth.ts          # Autentifikatsiya
│   ├── kpi.ts           # KPI boshqaruvi
│   └── storage.ts       # LocalStorage
├── styles/
│   └── globals.css      # Dizayn tizimi
├── App.tsx              # Asosiy komponent
├── AppRouter.tsx        # Routing
└── main.tsx             # Entry point
```

Eslatma: Dev server hozir 3000-portda ishlaydi. Portni o‘zgartirish uchun `vite.config.ts` dagi `server.port` qiymatini almashtiring.

## 🎨 Dizayn Tizimi

### Rang Palitra
- **Primary:** #2563EB (Asosiy ko'k)
- **Success:** #10B981 (Yashil - muvaffaqiyat)
- **Warning:** #F59E0B (Sariq - ogohlantirish)
- **Danger:** #EF4444 (Qizil - xavfli)

### Typography
- **Font:** Inter family
- **Sizes:** H1(24px), H2(20px), H3(18px), Body(16px), Small(14px)

### Spacing Scale
- **8-point system:** 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

## 🛠️ O'rnatish va Ishlatish

### Talablar
- Node.js 18+ 
- npm yoki yarn

### O'rnatish
```bash
# Dependencies o'rnatish
npm install

# Development server ishga tushirish
npm run dev

# Server default port: 3000 (vite.config.ts → server.port)
# Portni vaqtinchalik o'zgartirish:
# npm run dev -- --port 4000

# Production build
npm run build

# Linting
npm run lint
```

### Development
```bash
# Development server
npm run dev

# Build preview
npm run preview
```

## 🔧 Konfiguratsiya

### Environment Variables
```env
VITE_APP_TITLE=Boshqaruv
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon
```

### Tailwind CSS
Tailwind CSS v4 beta ishlatilmoqda. Custom design tokens va responsive breakpoint'lar sozlangan.

## 📱 Mobile Optimizatsiya

- **Touch-friendly:** 44px minimum touch targets
- **Responsive:** Barcha screen size'lar uchun
- **Performance:** Code splitting va lazy loading
- **PWA Ready:** Service worker va manifest

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📊 Performance Metrikalari

- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Bundle size:** < 500KB (gzipped)

## 🔒 Xavfsizlik

- **Authentication:** Role-based access control
- **Data validation:** Input sanitization
- **HTTPS:** Majburiy xavfsiz ulanish
- **LocalStorage:** Encrypted data storage

## 🌟 Kelajakdagi Xususiyatlar

- [ ] **Offline Support** - Service worker bilan
- [ ] **Push Notifications** - Real-time bildirishnomalar
- [ ] **AI Integration** - Smart task recommendations
- [ ] **Multi-language** - Qo'shimcha tillar
- [ ] **Advanced Analytics** - Custom dashboards

## 🤝 Hissa Qo'shish

1. Repository'ni fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing-feature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add amazing feature'`)
4. Branch'ni push qiling (`git push origin feature/amazing-feature`)
5. Pull Request yarating

## 📝 Litsenziya

Bu loyiha MIT litsenziyasi ostida tarqatiladi.

## 📞 Aloqa

- **Developer:** [Damir Nurmurodov]
- **Email:** [email@example.com]
- **Telegram:** [@username]

## 🙏 Minnatdorchilik

- [React](https://reactjs.org/) - Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons
- [Vite](https://vitejs.dev/) - Build tool

---

**Boshqaruv** - Zamonaviy mobil boshqaruv tizimi 🚀  