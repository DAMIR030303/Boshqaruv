# Boshqaruv - Mobil Dastur | Texnik Vazifa (TZ)

## 📱 Dastur Haqida Umumiy Ma'lumot

**Dastur nomi:** Boshqaruv  
**Platform:** Rork.com  
**Turi:** Progressive Web App (PWA)  
**Maqsad:** Xodimlar, vazifalar, davomat va marketing jarayonlarini boshqarish  
**Til:** O'zbek tili (Lotin yozuvi)  

---

## 🎨 Dizayn Tizimi va Brand Identity

### Rang Palitra
```css
/* Asosiy ranglar */
--primary: #2563EB        /* Asosiy ko'k rang */
--success: #10B981        /* Yashil (muvaffaqiyat) */
--warning: #F59E0B        /* Sariq (ogohlantirish) */
--danger: #EF4444         /* Qizil (xavfli) */

/* Neutral ranglar */
--background: #FFFFFF     /* Light mode fon */
--background-dark: #0B1220 /* Dark mode fon */
--foreground: #0B1220     /* Matn rangi */
--muted: #94A3B8          /* Ikkinchi darajali matn */
```

### Tipografiya
- **Asosiy shrift:** Inter (Google Fonts)
- **Hajmlar:** 
  - H1: 24px/32px (Semibold)
  - H2: 20px/28px (Semibold)
  - H3: 18px/26px (Medium)
  - Body: 16px/24px (Regular)
  - Small: 14px/20px (Regular)

### Spacing System (8pt Grid)
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px

### Border Radius
- Small: 12px
- Medium: 16px  
- Large: 20px
- Full: 50% (doiraviy elementlar)

---

## 👥 Foydalanuvchi Rollari va Ruxsatlar

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
  - Marketing strategiya boshqaruvi

### 4. Oddiy Xodim (user/user123)
- **F.I.O:** Javohir Tursunov  
- **Ruxsatlar:** Shaxsiy vazifalar va davomat
- **Interface:** Soddalashtirilgan employee paneli

---

## 📱 Mobil Interface Komponentlari

### Header Komponenti
```jsx
// Yuqori header - gradient background
- Logo/Dastur nomi (chapda)
- Foydalanuvchi profil ma'lumotlari
- Search tugmasi (qidiruv modal)
- Notifications tugmasi (bildirishnomalar)
- Theme toggle (Light/Dark mode)
```

### Navigation (Bottom Tab Bar)
```jsx
// 64x64px tugmalar - touch-friendly
// Gradient primary background (active state)
// Micro-animations va haptic feedback

Tabs:
1. 🏠 Bosh - Dashboard
2. 👥 Xodimlar - Employees Management  
3. ⏰ Davomat - Attendance Tracking
4. ✅ Vazifalar - Task Management
5. 👤 Profil - User Profile

// Floating Action Button (o'ng tomonda)
+ Vazifa yaratish - Yangi vazifa qo'shish
```

### Notification System
```jsx
// Real-time bildirishnomalar
- Badge indicators (qizil nuqta)
- Push notifications
- Interactive toast messages
- Sonner library integration
```

---

## 🔧 Funksional Talablar

### 1. Authentication System
```typescript
// Role-based login
interface User {
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'marketolog' | 'user';
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

// Login credentials
const credentials = [
  { username: 'admin', password: 'admin123' },
  { username: 'manager', password: 'manager123' },
  { username: 'marketolog', password: 'marketing123' },
  { username: 'user', password: 'user123' }
];
```

### 2. Real-time KPI Monitoring
```typescript
interface KPIData {
  attendance: {
    present: number;    // Kelganlar soni
    late: number;       // Kechikkanlar
    absent: number;     // Kelmagan
    total: number;      // Jami xodimlar
  };
  tasks: {
    completed: number;  // Bajarilgan vazifalar
    inProgress: number; // Jarayonda
    pending: number;    // Kutilayotgan
    total: number;      // Jami vazifalar
  };
  penalties: {
    active: number;     // Faol jarimalar
    resolved: number;   // Hal qilingan
    total: number;      // Jami
  };
}
```

### 3. Marketing Panel (Shaxriddin uchun)
```jsx
// Maxsus marketing dashboard
- Instagram post yaratish tool
- Video editing interface  
- Content calendar
- AI content generator
- Analytics va statistika
- Team collaboration tools
```

### 4. Task Management
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Attendance Tracking
```typescript
interface Attendance {
  id: string;
  employeeId: string;
  checkIn: Date;
  checkOut?: Date;
  status: 'present' | 'late' | 'absent';
  location?: string;
  notes?: string;
}
```

---

## 🎯 Rork.com Prompt Ketma-ketligi

### 1-qadam: Loyiha Boshlash
```prompt
Mobil dastur yaratish:
- Dastur nomi: "Boshqaruv" 
- Framework: React + TypeScript
- Styling: Tailwind CSS v4
- Icons: Lucide React
- Animations: Framer Motion
- Toast: Sonner
- Theme: Light/Dark mode support
```

### 2-qadam: Dizayn Tizimi Sozlash
```prompt
Tailwind CSS v4 konfiguratsiya:

Ranglar:
- primary: #2563EB
- success: #10B981  
- warning: #F59E0B
- danger: #EF4444

Font: Inter (Google Fonts)
Spacing: 8pt grid system (4, 8, 12, 16, 20, 24, 32, 40, 48px)
Border radius: 12px, 16px, 20px
Shadow system: sm, md, lg
```

### 3-qadam: Authentication
```prompt
Role-based login system yaratish:

Login sahifasi:
- Username/password fields
- Remember me checkbox
- Professional mobil dizayn
- Gradient background
- Smooth animations

Credentials:
- admin/admin123 (Administrator)
- manager/manager123 (Manager)  
- marketolog/marketing123 (Marketing boshqaruvchisi)
- user/user123 (Oddiy xodim)

LocalStorage: Login holatini saqlash
Session management: Auto-logout timer
```

### 4-qadam: Main Layout
```prompt
Mobil layout struktura:

1. Header komponenti (MobileHeader):
   - Logo va foydalanuvchi ma'lumotlari
   - Search tugmasi (modal bilan)
   - Notifications bell (badge bilan)
   - Theme toggle (sun/moon icon)
   - Gradient background
   - Fixed position (top)

2. Main content area:
   - Dynamic route rendering
   - Padding: top 16px, bottom 20px
   - Smooth page transitions
   - Loading states

3. Bottom navigation (TabBar):
   - 5 ta asosiy tab
   - 64x64px tugmalar
   - Gradient active states  
   - Badge indicators
   - Floating action button
   - Fixed position (bottom)
```

### 5-qadam: Dashboard (Bosh sahifa)
```prompt
Dashboard yaratish:

Admin/Manager uchun:
- KPI cards (attendance, tasks, penalties)
- Real-time ma'lumotlar
- Chart va grafiklar (Recharts)
- Quick actions
- Recent activities
- Responsive grid layout

Marketing (Shaxriddin) uchun:
- Instagram post counter (15-18/kun)
- Video editing progress (10-15/kun)  
- Content calendar
- AI tools panel
- Marketing analytics
- Team collaboration
```

### 6-qadam: Xodimlar Boshqaruvi
```prompt
Employees management:

1. Xodimlar ro'yxati:
   - Search va filter
   - Card/List view toggle
   - Employee details modal
   - Add/Edit/Delete employees
   - Import CSV functionality
   - Profile photos

2. Employee card design:
   - Photo, name, position
   - Status indicator (online/offline)
   - Contact information
   - Recent activity
   - Action buttons

3. Admin restrictions:
   Faqat "Shaxriddin Adizov Sherali o'g'li" ko'rinsin
   Boshqa xodimlar gizlin
```

### 7-qadam: Vazifalar Boshqaruvi
```prompt
Task management system:

1. Kanban board layout:
   - Drag & drop (react-dnd)
   - Status columns: Pending, In Progress, Completed
   - Task cards: title, assignee, due date, priority
   - Real-time updates

2. Task creation:
   - Modal form
   - Title, description, assignee
   - Due date picker
   - Priority selection
   - File attachments

3. Badge system:
   Tab bar da pending vazifalar soni
   Real-time count updates
   Color-coded by priority
```

### 8-qadam: Davomat Tizimi
```prompt
Attendance tracking:

1. Check-in/out interface:
   - Large action buttons
   - Current time display
   - Location detection
   - Photo capture
   - Status indicators

2. Attendance history:
   - Calendar view
   - Daily/weekly/monthly stats
   - Late arrivals highlight
   - Export functionality

3. Real-time monitoring:
   Present/late/absent counters
   Badge notifications for late employees
   Manager alerts
```

### 9-qadam: Profil va Sozlamalar
```prompt
User profile va settings:

1. Profile page:
   - User information
   - Avatar upload
   - Contact details
   - Activity history
   - Logout button

2. Settings:
   - Theme toggle (light/dark)
   - Language selection
   - Notification preferences
   - Privacy settings
   - About app

3. Marketing profile (Shaxriddin):
   - Special marketing role badge
   - Daily task progress
   - Performance metrics
   - AI tools access
```

### 10-qadam: Responsive va Accessibility
```prompt
Mobile optimization:

1. Touch-friendly design:
   - 44px minimum touch targets
   - Proper spacing (8pt grid)
   - Thumb-zone optimization
   - Swipe gestures

2. Accessibility (WCAG 2.1 AA):
   - Keyboard navigation
   - Screen reader support
   - High contrast mode
   - Focus indicators
   - Semantic HTML

3. Performance:
   - Lazy loading components
   - Image optimization  
   - Bundle splitting
   - Service worker (PWA)
```

### 11-qadam: Animations va Micro-interactions
```prompt
Framer Motion animations:

1. Page transitions:
   - Smooth slide animations
   - Loading states
   - Skeleton loaders
   - Progress indicators

2. Component animations:
   - Button hover states
   - Tab switching
   - Modal open/close
   - Toast notifications

3. Micro-interactions:
   - Tap feedback
   - Badge animations
   - Notification pings
   - Success celebrations
```

### 12-qadam: State Management
```prompt
React state management:

1. Global state:
   - Authentication status
   - User profile data
   - Theme preferences
   - Real-time KPI data

2. Local storage:
   - Session persistence
   - Theme preference
   - Recent searches
   - Draft forms

3. Real-time updates:
   - Mock data simulation
   - Interval-based updates
   - Event-driven changes
   - Optimistic UI updates
```

---

## 📊 Technical Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Animations:** Framer Motion  
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Notifications:** Sonner
- **Drag & Drop:** react-dnd

### Development Tools
- **Build:** Vite
- **Linting:** ESLint + Prettier
- **Testing:** Vitest + React Testing Library
- **Type checking:** TypeScript strict mode

### Mobile Optimization
- **PWA:** Service Worker + Manifest
- **Touch:** Optimized touch targets
- **Performance:** Code splitting, lazy loading
- **Accessibility:** WCAG 2.1 AA compliance

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (1-2 kun)
- ✅ Loyiha setup va konfiguratsiya
- ✅ Dizayn tizimi va ranglar
- ✅ Authentication system
- ✅ Basic layout structure

### Phase 2: Core Features (3-5 kun)
- ✅ Dashboard va KPI monitoring
- ✅ Employee management  
- ✅ Task management
- ✅ Attendance tracking

### Phase 3: Advanced Features (6-7 kun)
- ✅ Marketing panel (Shaxriddin uchun)
- ✅ Real-time notifications
- ✅ Advanced animations
- ✅ Mobile optimizations

### Phase 4: Polish (8-10 kun)
- ✅ Performance optimizations
- ✅ Accessibility improvements
- ✅ Testing va bug fixes
- ✅ Final UI/UX polishing

---

## 📝 Quality Requirements

### Performance
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Bundle size:** < 500KB (gzipped)

### Accessibility (WCAG 2.1 AA)
- Color contrast ratio: 4.5:1 minimum
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Alt text for images

### Browser Support
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+
- **PWA:** Service Worker support required

### Security
- XSS protection
- CSRF protection  
- Secure authentication
- Data validation
- Input sanitization

---

## 🔒 Ma'lumotlar Xavfsizligi

### Authentication
- JWT token-based auth
- Role-based access control (RBAC)
- Session timeout (30 daqiqa)
- Secure password hashing

### Data Protection
- HTTPS majburiy
- LocalStorage encryption
- Input validation va sanitization
- API rate limiting

### Privacy
- Minimal ma'lumot yig'ish
- GDPR compliance ready
- Clear privacy policy
- User consent management

---

## 📱 Mobile-First Features

### Touch Interactions
- **Tap:** 44px minimum touch target
- **Swipe:** Page navigation, card dismissal
- **Pinch:** Image zoom (agar kerak bo'lsa)
- **Pull-to-refresh:** Ma'lumotlarni yangilash

### Device Features
- **Camera:** Profile photos, attendance check-in
- **Location:** Geo-location for attendance  
- **Notifications:** Push notifications support
- **Offline:** Basic offline functionality

### Platform Integration
- **iOS:** Add to Home Screen, Safari optimizations
- **Android:** Chrome optimizations, manifest.json
- **PWA:** Service worker, app-like experience

---

## 🎨 UI/UX Design Principles

### Material Design + Custom
- **Elevation:** Card shadows va depth
- **Motion:** 60fps smooth animations
- **Typography:** Readable hierarchy
- **Color:** Meaningful color usage

### Mobile UX Best Practices
- **Thumb Zone:** Important actions bottom-right
- **One-handed use:** Easy navigation
- **Context:** Clear navigation breadcrumbs
- **Feedback:** Immediate action feedback

### Inclusive Design
- **High contrast:** Dark mode support
- **Large text:** Accessibility scaling
- **Simple language:** Clear, concise content
- **Error handling:** Helpful error messages

---

## 📈 Success Metrics

### User Experience
- **Task completion rate:** >95%
- **Navigation efficiency:** <3 taps to any feature
- **Error rate:** <2%
- **User satisfaction:** >4.5/5

### Performance
- **Load time:** <3 seconds
- **Crash rate:** <0.1%
- **Memory usage:** <100MB
- **Battery consumption:** Minimal impact

### Business Goals
- **Adoption rate:** >80% of employees
- **Daily active users:** >70%
- **Feature utilization:** >60% per feature
- **Support tickets:** <5% of users

---

## 📞 Support va Maintenance

### Documentation
- **API documentation:** OpenAPI 3.0
- **Component library:** Storybook
- **User guide:** In-app help
- **Developer docs:** Technical documentation

### Monitoring
- **Error tracking:** Sentry integration
- **Analytics:** User behavior tracking
- **Performance:** Core Web Vitals monitoring
- **Uptime:** 99.9% availability target

### Updates
- **Feature releases:** Monthly updates
- **Security patches:** Weekly if needed
- **Bug fixes:** 48-hour response time
- **User feedback:** Quarterly surveys

---

## 🔧 Development Guidelines

### Code Quality
```typescript
// TypeScript strict mode
// ESLint + Prettier configuration
// Component naming: PascalCase
// File structure: Feature-based organization
// Comments: JSDoc for complex functions
```

### Git Workflow
```bash
# Branch naming
feature/component-name
bugfix/issue-description
hotfix/critical-fix

# Commit messages
feat: add mobile navigation component
fix: resolve authentication token refresh
docs: update API documentation
style: improve button component styling
```

### Testing Strategy
```javascript
// Unit tests: Jest + React Testing Library
// Integration tests: Critical user flows
// E2E tests: Playwright for key scenarios
// Visual testing: Chromatic for UI regression
// Performance testing: Lighthouse CI
```

---

## 📋 Final Checklist

### Before Production
- [ ] All authentication roles tested
- [ ] Mobile responsiveness verified
- [ ] Accessibility audit completed
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Browser compatibility tested
- [ ] PWA functionality verified
- [ ] Error handling implemented
- [ ] Analytics integration complete
- [ ] Documentation updated

### Launch Preparation
- [ ] Production environment setup
- [ ] SSL certificate configured
- [ ] CDN configured for assets
- [ ] Database backup strategy
- [ ] Monitoring alerts configured
- [ ] Support documentation ready
- [ ] User training materials
- [ ] Rollback plan prepared

---

## 💡 Future Enhancements

### Phase 2 Features
- **Offline mode:** Full offline functionality
- **Push notifications:** Real-time alerts
- **Advanced analytics:** Custom dashboards
- **Integration:** Third-party tool connections
- **Multi-language:** Additional language support

### Advanced Features
- **AI integration:** Smart task recommendations
- **Voice commands:** Voice-activated actions
- **AR features:** Augmented reality check-ins
- **Biometric auth:** Fingerprint/Face ID
- **Advanced reporting:** Custom report builder

---
