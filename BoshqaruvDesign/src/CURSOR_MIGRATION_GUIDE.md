# Boshqaruv Ilovasini Cursor AI-ga Ko'chirish Yo'riqnomasi

## 1. Loyiha Setup

### Yangi Loyiha Yaratish
```bash
# 1. Yangi React TypeScript loyiha yarating
npm create vite@latest boshqaruv-app --template react-ts
cd boshqaruv-app

# 2. Barcha dependencies o'rnating
npm install tailwindcss@beta @tailwindcss/vite
npm install motion lucide-react sonner@2.0.3 react-hook-form@7.55.0
npm install date-fns clsx tailwind-merge
npm install -D @types/node vite
```

### Vite Konfiguratsiya
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

## 2. Fayllar Strukturasi

### Ko'chirish Tartibi:
1. `styles/globals.css` - Dizayn tizimi (to'liq ko'chiring)
2. `App.tsx` - Asosiy komponent
3. `/components` - Barcha komponentlar
4. `/utils` - Utility funkciyalar
5. `/hooks` - Custom hooks

### Muhim Fayllar:
- ✅ `styles/globals.css` (Tailwind v4 + custom tokens)
- ✅ `App.tsx` (Asosiy ilova logic)  
- ✅ `components/mobile/*` (Mobile komponentlar)
- ✅ `components/ui/*` (Shadcn UI komponentlar)
- ✅ `utils/localStorageCleanup.ts`
- ✅ `boshqaruv_tz.md` (Texnik vazifa)

## 3. Package.json Sozlash

```json
{
  "name": "boshqaruv-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "4.0.0-beta.3",
    "@tailwindcss/vite": "4.0.0-beta.3",
    "motion": "^10.18.0",
    "lucide-react": "^0.400.0",
    "sonner": "2.0.3",
    "react-hook-form": "7.55.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@types/node": "^20.14.8",
    "@typescript-eslint/eslint-plugin": "^7.2.0",
    "@typescript-eslint/parser": "^7.2.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

## 4. Cursor AI bilan Ish Olib Borish

### AI Prompt Template
```markdown
Men "Boshqaruv" nomli mobil boshqaruv tizimi ilovasi ustida ishlayapman.

KONTEKST:
- O'zbek tilida UI matnlar
- Role-based auth: admin/admin123, manager/manager123, user/user123, marketolog/marketing123  
- Custom design tokens: #2563EB (asosiy), #10B981 (success), #F59E0B (warning), #EF4444 (danger)
- Tailwind v4 + Inter typography
- Mobile-first responsive design
- Shaxriddin Adizov (Marketing boshqaruvchisi) uchun maxsus panel

MASALA: [Aniq masalani yozing]

TALABLAR:
- O'zbek tilida barcha matnlar
- Professional gradient backgrounds
- Smooth animations (motion/react)
- Touch-friendly mobile UI
- 8-point spacing scale
```

### Kode Strukturasi Namunasi
```typescript
// Asosiy interface'lar
interface UserProfile {
  name: string;
  role: 'Administrator' | 'Manager' | 'Xodim' | 'Marketing boshqaruvchisi';
  avatar: string;
  status: 'online' | 'offline';
}

interface KPIData {
  attendance: {
    present: number;
    late: number;
    absent: number;
    total: number;
  };
  tasks: {
    completed: number;
    inProgress: number;
    pending: number;
    total: number;
  };
  penalties: {
    active: number;
    resolved: number;
    total: number;
  };
}

// Mobile komponent props
interface MobileComponentProps {
  kpiData?: KPIData;
  userProfile?: UserProfile;
  onDataUpdate?: (data: any) => void;
  onNavigate?: (tab: string) => void;
  isDark?: boolean;
}
```

## 5. Rivojlantirish Yo'nalishi

### Keyingi Qadamlar:
1. **Backend Integration**
   - Supabase yoki Firebase bilan bog'lash
   - Real-time ma'lumotlar sinxronizatsiyasi
   - User authentication va authorization

2. **Shaxriddin uchun Marketing Tools**
   - AI content generator (GPT integration)
   - Instagram post scheduler
   - Video editing workflow
   - Analytics dashboard
   - Team collaboration features

3. **Performance Optimizations**
   - Code splitting
   - Image optimization
   - Lazy loading
   - Service Worker (PWA)

4. **Testing va Deployment**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - CI/CD pipeline
   - Vercel/Netlify deployment

## 6. Muhim Eslatmalar

### Texnik:
- TypeScript strict mode yoqilgan
- Tailwind v4 beta ishlatilmoqda
- Motion v10+ (Framer Motion yangi nomi)
- Mobile-first approach

### Dizayn:
- Inter font family
- 8-point spacing scale (4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px)
- Custom border radius (12px, 16px, 20px)
- Professional gradient backgrounds
- Dark/light theme support

### Rollar:
- **Admin**: To'liq ruxsatlar
- **Manager**: Cheklangan boshqaruv
- **User**: Asosiy xodim interfeysi  
- **Marketolog**: Shaxriddin uchun maxsus marketing panel

## 7. Loyiha Fayllari Yo'lagi

```
src/
├── App.tsx                    # Asosiy komponent
├── styles/globals.css         # Dizayn tizimi
├── components/
│   ├── ui/                   # Shadcn komponentlar
│   ├── mobile/               # Mobile komponentlar
│   ├── ErrorBoundary.tsx     # Xatoliklar boshqaruvi
│   └── LoadingFallback.tsx   # Loading states
├── utils/
│   └── localStorageCleanup.ts
├── hooks/
│   ├── useAsyncOperation.ts
│   └── usePerformanceMonitor.ts
└── boshqaruv_tz.md           # Texnik vazifa
```
