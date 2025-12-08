# ✅ MANUAL QA TESTING PLAN

**Sana:** 2024-12-09  
**Versiya:** 1.0.0 MVP  
**Texnologiya:** Vite + React + TypeScript + Supabase

---

## 📋 TEST SCOPE

### Critical Features (MUST TEST)
- ✅ Authentication (Login/Logout)
- ✅ Dashboard
- ✅ Task Management (CRUD)
- ✅ Employee Management (CRUD)
- ✅ Reports
- ✅ Notifications
- ✅ Search
- ✅ Multi-language

### UI/UX Components (MUST TEST)
- ✅ ConfirmationDialog
- ✅ SuccessAnimation
- ✅ OnboardingFlow
- ✅ EmptyState
- ✅ SkeletonLoader
- ✅ ErrorState

### Cross-cutting Concerns
- ✅ Dark mode
- ✅ Responsive design
- ✅ Real-time updates
- ✅ Performance

---

## 🧪 TEST CASES

### 1. AUTHENTICATION TESTING

#### TC-AUTH-001: Login - Valid Credentials
**Steps:**
1. `pnpm dev` ishga tushiring
2. Login sahifasiga o'ting
3. To'g'ri username/password kiriting
4. "Kirish" tugmasini bosing

**Expected:**
- ✅ Dashboard sahifasiga yo'naltiriladi
- ✅ User profil ma'lumotlari ko'rinadi
- ✅ Success animation ko'rsatiladi

**Status:** ⬜ PENDING

---

#### TC-AUTH-002: Login - Invalid Credentials
**Steps:**
1. Login sahifasiga o'ting
2. Noto'g'ri username/password kiriting
3. "Kirish" tugmasini bosing

**Expected:**
- ✅ Error message ko'rsatiladi
- ✅ Login sahifasida qolinadi
- ✅ ErrorState component ishlaydi

**Status:** ⬜ PENDING

---

#### TC-AUTH-003: Logout
**Steps:**
1. Tizimga kiring
2. Header'dagi profile tugmasini bosing
3. "Chiqish" tugmasini bosing
4. ConfirmationDialog'da "Tasdiqlash" bosing

**Expected:**
- ✅ ConfirmationDialog ko'rsatiladi
- ✅ Login sahifasiga qaytariladi
- ✅ Session tozalanadi

**Status:** ⬜ PENDING

---

### 2. DASHBOARD TESTING

#### TC-DASH-001: Dashboard Load
**Steps:**
1. Tizimga kiring
2. Dashboard sahifasini kuzating

**Expected:**
- ✅ SkeletonLoader avval ko'rsatiladi
- ✅ Statistika card'lari to'g'ri yuklanadi
- ✅ Real-time status indicator ishlaydi
- ✅ Quick actions ko'rinadi

**Status:** ⬜ PENDING

---

#### TC-DASH-002: Quick Actions
**Steps:**
1. Dashboard'da biror quick action bosing
2. Modal yoki sahifa ochilishini kuzating

**Expected:**
- ✅ Mos sahifa/modal ochiladi
- ✅ Animatsiyalar smooth ishlaydi

**Status:** ⬜ PENDING

---

### 3. TASK MANAGEMENT TESTING

#### TC-TASK-001: Create Task
**Steps:**
1. Tasks sahifasiga o'ting
2. "Yangi vazifa" tugmasini bosing
3. Form to'ldiring
4. "Saqlash" bosing

**Expected:**
- ✅ TaskForm modal ochiladi
- ✅ Validation ishlaydi
- ✅ Success animation ko'rsatiladi
- ✅ Yangi task list'da paydo bo'ladi (real-time)

**Status:** ⬜ PENDING

---

#### TC-TASK-002: Update Task
**Steps:**
1. Tasks list'dan bitta task tanlang
2. Edit tugmasini bosing
3. Ma'lumotlarni o'zgartiring
4. "Saqlash" bosing

**Expected:**
- ✅ TaskForm pre-filled data bilan ochiladi
- ✅ O'zgarishlar saqlanadi
- ✅ Success animation
- ✅ Task list yangilanadi (real-time)

**Status:** ⬜ PENDING

---

#### TC-TASK-003: Delete Task
**Steps:**
1. Task'ning Delete tugmasini bosing
2. ConfirmationDialog'da "Tasdiqlash" bosing

**Expected:**
- ✅ ConfirmationDialog ko'rsatiladi
- ✅ Task o'chiriladi
- ✅ List yangilanadi (real-time)
- ✅ Success animation

**Status:** ⬜ PENDING

---

#### TC-TASK-004: Empty State
**Steps:**
1. Barcha tasklar o'chirilgandan keyin kuzating

**Expected:**
- ✅ EmptyState component ko'rsatiladi
- ✅ "Vazifa qo'shish" action button ishlaydi

**Status:** ⬜ PENDING

---

### 4. EMPLOYEE MANAGEMENT TESTING

#### TC-EMP-001: Employee List Load
**Steps:**
1. Employees sahifasiga o'ting

**Expected:**
- ✅ SkeletonLoader ko'rsatiladi
- ✅ Employee card'lari yuklanadi
- ✅ Search filter ishlaydi

**Status:** ⬜ PENDING

---

#### TC-EMP-002: Create Employee
**Steps:**
1. "Yangi xodim" tugmasini bosing
2. Form to'ldiring
3. "Saqlash" bosing

**Expected:**
- ✅ Validation ishlaydi
- ✅ Success animation
- ✅ List yangilanadi

**Status:** ⬜ PENDING

---

### 5. UI/UX COMPONENTS TESTING

#### TC-UI-001: ConfirmationDialog
**Steps:**
1. Biror delete action bosing
2. Dialog'da "Bekor qilish" bosing
3. Yana delete bosing
4. Dialog'da "Tasdiqlash" bosing

**Expected:**
- ✅ Dialog ochiladi/yopiladi
- ✅ Keyboard shortcuts (Enter/Escape) ishlaydi
- ✅ Dark mode'da to'g'ri ko'rinadi

**Status:** ⬜ PENDING

---

#### TC-UI-002: SuccessAnimation
**Steps:**
1. Biror save action bajaring
2. Success animation kuzating

**Expected:**
- ✅ Checkmark animation smooth
- ✅ 2 soniyadan keyin avtomatik yopiladi
- ✅ Dark mode'da ko'rinadi

**Status:** ⬜ PENDING

---

#### TC-UI-003: OnboardingFlow
**Steps:**
1. LocalStorage'ni tozalang
2. Sahifani refresh qiling
3. Onboarding slides'ni ko'rib chiqing

**Expected:**
- ✅ 4 ta slide to'g'ri ko'rsatiladi
- ✅ Navigation buttons ishlaydi
- ✅ Progress dots interactive
- ✅ "O'tkazib yuborish" ishlaydi
- ✅ LocalStorage'ga saqlanadi

**Status:** ⬜ PENDING

---

### 6. SEARCH TESTING

#### TC-SEARCH-001: Global Search
**Steps:**
1. Header'dagi search icon bosing
2. Qidiruv so'zini kiriting
3. Natijalarni kuzating

**Expected:**
- ✅ Search modal ochiladi
- ✅ Real-time search
- ✅ EmptyState agar natija yo'q bo'lsa

**Status:** ⬜ PENDING

---

### 7. MULTI-LANGUAGE TESTING

#### TC-LANG-001: Language Switch
**Steps:**
1. Settings → Language
2. Uzbek → English → Russian
3. UI elementlarini kuzating

**Expected:**
- ✅ Barcha textlar tarjima bo'ladi
- ✅ Smooth transition
- ✅ LocalStorage'ga saqlanadi

**Status:** ⬜ PENDING

---

### 8. DARK MODE TESTING

#### TC-DARK-001: Dark Mode Toggle
**Steps:**
1. Settings → Theme
2. Light → Dark → Light
3. Barcha sahifalarni kuzating

**Expected:**
- ✅ Smooth transition
- ✅ Barcha komponentlar dark mode'da to'g'ri
- ✅ LocalStorage'ga saqlanadi

**Status:** ⬜ PENDING

---

### 9. RESPONSIVE DESIGN TESTING

#### TC-RESP-001: Mobile View
**Steps:**
1. Chrome DevTools → Device toolbar
2. iPhone SE (375px)
3. Barcha sahifalarni test qiling

**Expected:**
- ✅ Bottom navigation ko'rinadi
- ✅ Barcha elementlar mobile-friendly
- ✅ Touch targets >44px

**Status:** ⬜ PENDING

---

#### TC-RESP-002: Tablet View
**Steps:**
1. iPad (768px) view
2. Barcha sahifalarni test qiling

**Expected:**
- ✅ Layout to'g'ri adjust bo'ladi
- ✅ Navigation hybrid mode

**Status:** ⬜ PENDING

---

#### TC-RESP-003: Desktop View
**Steps:**
1. Desktop (1920px) view
2. Barcha sahifalarni test qiling

**Expected:**
- ✅ Sidebar visible
- ✅ Max-width constraints
- ✅ Optimal spacing

**Status:** ⬜ PENDING

---

### 10. REAL-TIME TESTING

#### TC-RT-001: Real-time Updates
**Steps:**
1. 2 ta browser tab ochng
2. Bitta tab'da task yarating
3. Ikkinchi tab'ni kuzating

**Expected:**
- ✅ Yangi task avtomatik paydo bo'ladi
- ✅ Real-time indicator active

**Status:** ⬜ PENDING

---

### 11. ERROR HANDLING TESTING

#### TC-ERR-001: Network Error
**Steps:**
1. Chrome DevTools → Network → Offline
2. Biror action bajaring

**Expected:**
- ✅ ErrorState ko'rsatiladi
- ✅ "Qayta urinish" button ishlaydi

**Status:** ⬜ PENDING

---

#### TC-ERR-002: 404 Page
**Steps:**
1. Mavjud bo'lmagan URL'ga o'ting
2. /non-existent-page

**Expected:**
- ✅ 404 error page ko'rsatiladi
- ✅ "Bosh sahifaga" button ishlaydi

**Status:** ⬜ PENDING

---

## 🎯 TEST EXECUTION

### Environment Setup
```bash
# Dev server
pnpm dev

# Production build test
pnpm build
npx serve dist
```

### Browser Testing
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (mobile)
- ✅ Edge (latest)

### Device Testing
- ✅ iPhone SE (375px)
- ✅ iPhone 12 Pro (390px)
- ✅ iPad (768px)
- ✅ Desktop (1920px)

---

## 📊 TEST SUMMARY

**Total Test Cases:** 23  
**Completed:** 0  
**Passed:** 0  
**Failed:** 0  
**Blocked:** 0  

---

## 🐛 BUG TRACKING

### Bug Template
```markdown
**Bug ID:** BUG-001  
**Title:** [Qisqa tavsif]  
**Severity:** Critical / High / Medium / Low  
**Steps to Reproduce:**
1. ...
2. ...

**Expected:** ...  
**Actual:** ...  
**Screenshots:** ...  
**Environment:** Browser, OS, Screen size
```

---

## ✅ SIGN-OFF CRITERIA

MVP production'ga chiqarish uchun:
- ✅ Critical test cases 100% passed
- ✅ No critical bugs
- ✅ Performance metrics ✅
- ✅ Security review ✅
- ✅ Accessibility check ✅

---

**QA Engineer:** [Name]  
**Date Started:**  
**Date Completed:**  
**Final Status:**
