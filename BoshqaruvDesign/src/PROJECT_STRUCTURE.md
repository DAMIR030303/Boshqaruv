# Boshqaruv - Loyiha Strukturasi va Fayllar Tavsifi

## 📁 Asosiy Fayllar

### `/App.tsx` - Asosiy Komponent
- **Vazifasi**: Ilova routing, authentication, theme management
- **Xususiyatlar**: 
  - Role-based interface rendering
  - Dark/light theme support
  - Mobile-optimized lazy loading
  - Real-time KPI updates
  - Local storage management

### `/styles/globals.css` - Dizayn Tizimi
- **Tailwind v4** konfiguratsiya
- **Custom design tokens** (#2563EB, #10B981, #F59E0B, #EF4444)
- **Inter typography** ierarxiyasi
- **8-point spacing** scale
- **Responsive grid** system
- **Dark theme** variables
- **Accessibility** features

### `/boshqaruv_tz.md` - Texnik Vazifa
- To'liq texnik talab hujjati
- Rork.com platformasi uchun tayyor TZ
- Barcha funksional talablar
- UI/UX spetsifikatsiyalar

## 📱 Mobile Komponentlar (`/components/mobile/`)

### Asosiy Navigation
- **`MobileHeader.tsx`** - Top navigation bar
- **`MobileTabBar.tsx`** - Admin/Manager bottom navigation  
- **`EmployeeTabBar.tsx`** - Employee bottom navigation
- **`MobileLogin.tsx`** - Authentication screen

### Dashboard va Analytics
- **`MobileDashboard.tsx`** - Admin dashboard
- **`EmployeeDashboard.tsx`** - Employee dashboard
- **`MarketingAnalytics.tsx`** - Shaxriddin uchun analytics

### Vazifa Boshqaruvi
- **`MobileTasks.tsx`** - Admin task management
- **`EmployeeTasks.tsx`** - Employee task view
- **`MobileTasksScreen.tsx`** - Enhanced task interface

### Davomat Tizimi  
- **`MobileAttendance.tsx`** - Admin attendance management
- **`EmployeeAttendance.tsx`** - Employee check-in/out
- **`CheckInScreen.tsx`** - Check-in interface
- **`EnhancedCheckInScreen.tsx`** - Advanced check-in
- **`CheckInMethods.tsx`** - Multiple check-in options
- **`CheckInAnimations.tsx`** - UI animations

### Hisobotlar
- **`MobileReports.tsx`** - Admin reports
- **`EmployeeReports.tsx`** - Employee reports
- **`ReportViewModal.tsx`** - Report viewer

### Marketing Tools (Shaxriddin uchun)
- **`MarketingContentManager.tsx`** - Content management
- **`AIContentGenerator.tsx`** - AI-powered content creation

### Xodimlar va Smenalar
- **`MobileEmployees.tsx`** - Employee management
- **`MobileShifts.tsx`** - Shift scheduling

### Sozlamalar va Profil
- **`MobileSettings.tsx`** - App settings
- **`MobileProfile.tsx`** - User profile
- **`MobilePenalties.tsx`** - Penalties management

## 🧩 UI Komponentlar (`/components/ui/`)

### Shadcn UI Library
- **Button, Input, Card** - Asosiy UI elementlar
- **Dialog, Sheet, Drawer** - Modal va slide-out panels
- **Table, Form** - Ma'lumotlar ko'rsatish
- **Chart** - Analytics va hisobotlar uchun
- **Calendar, DatePicker** - Sana tanlash
- **Toast (Sonner)** - Bildirishnomalar

### Custom Enhanced Components
- **`button-enhanced.tsx`** - Boshqaruv style button
- **`input-enhanced.tsx`** - Custom input fields
- **`accessibility.tsx`** - Accessibility utilities

## 🔧 Utility va Hook'lar

### `/utils/`
- **`localStorageCleanup.ts`** - Storage management
- **`supabase/info.tsx`** - Backend integration info

### `/hooks/`
- **`useAsyncOperation.ts`** - Async state management
- **`usePerformanceMonitor.ts`** - Performance tracking

## 🎯 Maxsus Komponentlar

### Administrator Interface
- **`AdminDashboard.tsx`** - Full admin panel
- **`EmployeesPage.tsx`** - Employee management
- **`ShiftsPage.tsx`** - Shift scheduling
- **`ReportsPage.tsx`** - Comprehensive reports

### Employee Interface  
- **`EmployeeDashboard.tsx`** - Employee home
- **`MyDayScreen.tsx`** - Daily tasks view
- **`ProfileScreen.tsx`** - Personal profile

### Marketing Panel (Shaxriddin)
- Instagram post management
- Video editing workflow  
- Content analytics
- AI content generation
- Team collaboration

## 📊 Ma'lumotlar Strukturasi

### User Roles
```typescript
type UserRole = 
  | 'Administrator' 
  | 'Manager' 
  | 'Xodim' 
  | 'Marketing boshqaruvchisi';
```

### KPI Data Structure
```typescript
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
```

## 🎨 Dizayn Tizimi Xususiyatlari

### Rang Palitirasi
- **Primary**: #2563EB (Asosiy ko'k)
- **Success**: #10B981 (Yashil - muvaffaqiyat)
- **Warning**: #F59E0B (Sariq - ogohlantirish)  
- **Danger**: #EF4444 (Qizil - xavfli)

### Typography
- **Font**: Inter family
- **Sizes**: H1(24px), H2(20px), H3(18px), Body(16px), Small(14px)
- **Weights**: Normal(400), Medium(500), Semibold(600), Bold(700)

### Spacing Scale
- **8-point system**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Responsive Breakpoints
- **Mobile**: 360px-390px (4 columns)
- **Tablet**: 768px-1024px (8 columns)  
- **Desktop**: 1024px+ (12 columns)

## 🚀 Performance Optimizations

### Code Splitting
- Lazy loading barcha mobile komponentlar
- Route-based splitting
- Component-level splitting

### Animations
- **Motion/React** (Framer Motion v10+)
- Smooth transitions
- Touch-friendly interactions
- Reduced motion support

### Accessibility
- WCAG AA compliance
- Screen reader support
- High contrast mode
- Keyboard navigation
- Focus management

## 📝 Development Notes

### Key Features
- ✅ Mobile-first responsive design
- ✅ Role-based authentication  
- ✅ Real-time KPI updates
- ✅ Dark/light theme support
- ✅ Professional UI/UX
- ✅ O'zbek tilida interface
- ✅ Touch-optimized interactions

### Shaxriddin Marketing Panel
- 15-18 ta Instagram post kuniga
- 10-15 ta video montaj
- Content monitoring va tahlil
- AI yordamida kontent ishlab chiqish
- Marketing strategiya boshqaruvi
- Jamoaviy hamkorlik

### Admin Panel Speciality
- Faqat Shaxriddin ko'rinadi employees ro'yxatida
- Boshqa xodimlar admin panelda ko'rinmaydi
- Marketing role uchun maxsus interface

---

Bu struktura bo'yicha loyihani Cursor AI-da to'liq qayta qurish va rivojlantirish