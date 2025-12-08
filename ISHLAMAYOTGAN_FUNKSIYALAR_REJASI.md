# Ishlamayotgan Funksiyalar Tuzatish Rejasi

**Sana:** 2025-12-01  
**Status:** Rejalashtirilgan

---

## 🎯 MAQSAD

Dastur tekshiruvi natijalariga asosan, ishlamayotgan funksiyalarni aniqlash va ularni tuzatish uchun batafsil reja tuzish.

---

## 📋 MUAMMOLAR VA HAL QILISH REJASI

### 1. Supabase API Konfiguratsiyasi Muammosi (MUHIM - Priority 1)

**Muammo:**
- Supabase API ga ulanishda `ERR_NAME_NOT_RESOLVED` xatosi
- `placeholder.supabase.co` ga ulanishda muammo
- Vazifalar ma'lumotlari yuklanmayapti
- Real-time yangilanishlar ishlamayapti

**Hal qilish bosqichlari:**

#### 1.1. Supabase Client Konfiguratsiyasini Tekshirish
- [ ] `src/utils/supabaseClient.ts` faylini ochish va tekshirish
- [ ] Supabase URL va API key'ning qayerdan olinayotganini aniqlash
- [ ] Environment variable'lar to'g'ri o'rnatilganini tekshirish

#### 1.2. Environment Variables'ni To'g'rilash
- [ ] `.env` faylini tekshirish (agar mavjud bo'lsa)
- [ ] `.env.example` faylini tekshirish
- [ ] To'g'ri Supabase URL va API key'ni o'rnatish
- [ ] Agar `.env` fayli yo'q bo'lsa, yaratish

#### 1.3. Supabase Client Kodini Yangilash
- [ ] `supabaseClient.ts` faylida hardcoded `placeholder.supabase.co` ni tekshirish
- [ ] Environment variable'lardan o'qish funksiyasini qo'shish
- [ ] Xato holatlarini boshqarish (error handling) qo'shish

#### 1.4. Test Qilish
- [ ] Dasturni qayta ishga tushirish
- [ ] Console xatolarini tekshirish
- [ ] Vazifalar ma'lumotlarini yuklashni tekshirish
- [ ] Real-time yangilanishlarni tekshirish

**Kutilayotgan natija:**
- Supabase API ga muvaffaqiyatli ulanish
- Vazifalar ma'lumotlari yuklanadi
- Real-time yangilanishlar ishlaydi
- Console'da Supabase xatolari yo'q

**Vaqt:** 30-60 daqiqa

---

### 2. Qidiruv Modal UI Muammosi (O'RTA - Priority 2)

**Muammo:**
- Qidiruv modal ochilganida boshqa header tugmalariga bosib bo'lmayapti
- Bildirishnomalar, Theme toggle, Profil dropdown, Menu tugmalariga bosib bo'lmayapti
- Pointer events intercept qilinmoqda

**Hal qilish bosqichlari:**

#### 2.1. SearchModal Komponentini Tekshirish
- [ ] `src/components/mobile/SearchModal.tsx` faylini ochish
- [ ] Modal overlay'ning CSS xususiyatlarini tekshirish
- [ ] `pointer-events` va `z-index` qiymatlarini tekshirish

#### 2.2. Modal Overlay CSS'ni To'g'rilash
- [ ] Modal overlay'ning `pointer-events: none` qilish (yoki faqat modal ichidagi elementlarga `pointer-events: auto`)
- [ ] Yoki modal overlay'ga bosilganda modal yopilishi funksiyasini qo'shish (click outside to close)
- [ ] `z-index` qiymatini to'g'rilash (agar kerak bo'lsa)

#### 2.3. MobileHeader Komponentini Tekshirish
- [ ] `src/components/mobile/MobileHeader.tsx` faylini ochish
- [ ] Qidiruv modal'ning qanday ochilayotganini tekshirish
- [ ] Header tugmalarining z-index qiymatlarini tekshirish

#### 2.4. Test Qilish
- [ ] Qidiruv modalni ochish
- [ ] Boshqa header tugmalariga bosib ko'rish
- [ ] Modal overlay'ga bosilganda modal yopilishini tekshirish
- [ ] Barcha header tugmalarining ishlashini tekshirish

**Kutilayotgan natija:**
- Qidiruv modal ochilganida ham boshqa header tugmalariga bosib bo'ladi
- Yoki modal overlay'ga bosilganda modal yopiladi
- Barcha header funksiyalari to'g'ri ishlaydi

**Vaqt:** 30-45 daqiqa

---

### 3. Bottom Navigation Pointer Events Muammosi (O'RTA - Priority 2)

**Muammo:**
- Davomat tab tugmasiga bosilganda sahifa ochilmayapti
- Home button (Bosh tugmasi) pointer events'ni intercept qilmoqda
- Ba'zi tab tugmalariga bosib bo'lmayapti

**Hal qilish bosqichlari:**

#### 3.1. MobileTabBar Komponentini Tekshirish
- [ ] `src/components/mobile/MobileTabBar.tsx` faylini ochish
- [ ] Home button'ning CSS xususiyatlarini tekshirish
- [ ] Tab tugmalarining CSS xususiyatlarini tekshirish
- [ ] `pointer-events` va `z-index` qiymatlarini tekshirish

#### 3.2. EmployeeTabBar Komponentini Tekshirish
- [ ] `src/components/mobile/EmployeeTabBar.tsx` faylini ochish
- [ ] Xuddi shu muammolarni tekshirish

#### 3.3. CSS'ni To'g'rilash
- [ ] Home button'ning `pointer-events` va `z-index` qiymatlarini to'g'rilash
- [ ] Tab tugmalarining `pointer-events` va `z-index` qiymatlarini to'g'rilash
- [ ] Agar kerak bo'lsa, tab tugmalarining `position` xususiyatini o'zgartirish

#### 3.4. Test Qilish
- [ ] Barcha tab tugmalariga bosib ko'rish
- [ ] Davomat sahifasiga o'tishni tekshirish
- [ ] Boshqa sahifalarga o'tishni tekshirish
- [ ] Home button'ning ishlashini tekshirish

**Kutilayotgan natija:**
- Barcha tab tugmalariga bosib bo'ladi
- Davomat sahifasiga muvaffaqiyatli o'tiladi
- Barcha navigation funksiyalari to'g'ri ishlaydi

**Vaqt:** 30-45 daqiqa

---

### 4. Qidiruv Modal Yopish Funksiyasini Yaxshilash (PAST - Priority 3)

**Muammo:**
- Qidiruv modalni yopish uchun faqat "Yopish" tugmasini ishlatish kerak
- Modal overlay'ga bosilganda modal yopilmayapti

**Hal qilish bosqichlari:**

#### 4.1. SearchModal Komponentini Yangilash
- [ ] `src/components/mobile/SearchModal.tsx` faylini ochish
- [ ] Modal overlay'ga `onClick` handler qo'shish
- [ ] Click outside to close funksiyasini implement qilish
- [ ] ESC tugmasiga bosilganda modal yopilishini qo'shish (ixtiyoriy)

#### 4.2. Test Qilish
- [ ] Modal overlay'ga bosilganda modal yopilishini tekshirish
- [ ] "Yopish" tugmasining ishlashini tekshirish
- [ ] ESC tugmasining ishlashini tekshirish (agar qo'shilgan bo'lsa)

**Kutilayotgan natija:**
- Modal overlay'ga bosilganda modal yopiladi
- "Yopish" tugmasi ishlaydi
- ESC tugmasi ishlaydi (agar qo'shilgan bo'lsa)

**Vaqt:** 15-30 daqiqa

---

### 5. Employee Rolida To'liq Tekshiruv (PAST - Priority 3)

**Muammo:**
- Employee rolida sahifalar tekshirilmadi
- Hozirgi foydalanuvchi Administrator roliga ega

**Hal qilish bosqichlari:**

#### 5.1. Employee Rolida Foydalanuvchi Yaratish
- [ ] Employee rolida test foydalanuvchi yaratish
- [ ] Yoki mavjud Employee foydalanuvchi bilan kirish

#### 5.2. Employee Sahifalarini Tekshirish
- [ ] Employee Dashboard'ni tekshirish
- [ ] Employee Tasks'ni tekshirish
- [ ] Employee Attendance'ni tekshirish
- [ ] Employee Reports'ni tekshirish
- [ ] Employee TabBar'ni tekshirish

#### 5.3. Muammolarni Aniqlash va Tuzatish
- [ ] Agar muammolar topilsa, ularni aniqlash
- [ ] Muammolarni tuzatish
- [ ] Qayta tekshirish

**Kutilayotgan natija:**
- Employee rolida barcha sahifalar to'g'ri ishlaydi
- Employee TabBar to'g'ri ishlaydi
- Barcha Employee funksiyalari to'g'ri ishlaydi

**Vaqt:** 30-60 daqiqa

---

## 📊 PRIORITIZATSIYA

| Priority | Muammo | Vaqt | Status |
|----------|--------|------|--------|
| 1 | Supabase API Konfiguratsiyasi | 30-60 min | ⏳ Kutilmoqda |
| 2 | Qidiruv Modal UI Muammosi | 30-45 min | ⏳ Kutilmoqda |
| 2 | Bottom Navigation Pointer Events | 30-45 min | ⏳ Kutilmoqda |
| 3 | Qidiruv Modal Yopish Funksiyasi | 15-30 min | ⏳ Kutilmoqda |
| 3 | Employee Rolida Tekshiruv | 30-60 min | ⏳ Kutilmoqda |

**Jami vaqt:** 2-4 soat

---

## 🔄 ISH TARTIBI

### Bosqich 1: Muhim Muammolarni Hal Qilish (Priority 1)
1. Supabase API konfiguratsiyasini to'g'rilash
2. Test qilish va tasdiqlash

### Bosqich 2: O'rta Muammolarni Hal Qilish (Priority 2)
3. Qidiruv modal UI muammosini hal qilish
4. Bottom navigation pointer events muammosini hal qilish
5. Test qilish va tasdiqlash

### Bosqich 3: Qo'shimcha Yaxshilashlar (Priority 3)
6. Qidiruv modal yopish funksiyasini yaxshilash
7. Employee rolida to'liq tekshiruv
8. Test qilish va tasdiqlash

---

## ✅ TASDIQLASH MEZONLARI

Har bir muammo hal qilingandan keyin quyidagilarni tekshirish kerak:

1. **Funksional Test:**
   - Muammo hal qilinganini tasdiqlash
   - Barcha tegishli funksiyalar to'g'ri ishlaydi

2. **UI/UX Test:**
   - UI elementlar to'g'ri ko'rsatilmoqda
   - Foydalanuvchi interaksiyasi to'g'ri ishlaydi

3. **Console Test:**
   - Xatolar yo'q
   - Warning'lar minimal

4. **Cross-browser Test:**
   - Barcha brauzerlarda to'g'ri ishlaydi (agar kerak bo'lsa)

---

## 📝 ESKIZLAR VA KOD O'ZGARISHLARI

### 1. Supabase Client Konfiguratsiyasi

**Fayl:** `src/utils/supabaseClient.ts`

```typescript
// Hozirgi holat (taxminan):
const supabaseUrl = 'https://placeholder.supabase.co';
const supabaseKey = 'placeholder-key';

// To'g'rilangan holat:
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL va API key o\'rnatilmagan!');
}
```

**Fayl:** `.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 2. SearchModal CSS To'g'rilash

**Fayl:** `src/components/mobile/SearchModal.tsx`

```tsx
// Modal overlay'ga click handler qo'shish:
<div 
  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20"
  onClick={onClose} // Click outside to close
>
  <div 
    className="..."
    onClick={(e) => e.stopPropagation()} // Modal ichidagi elementlarga bosilganda yopilmasin
  >
    {/* Modal content */}
  </div>
</div>
```

### 3. Bottom Navigation CSS To'g'rilash

**Fayl:** `src/components/mobile/MobileTabBar.tsx`

```tsx
// Home button va tab tugmalarining z-index va pointer-events'ni to'g'rilash:
<button 
  className="..."
  style={{ zIndex: 10, pointerEvents: 'auto' }}
>
  {/* Home button */}
</button>

<button 
  className="..."
  style={{ zIndex: 10, pointerEvents: 'auto' }}
>
  {/* Tab button */}
</button>
```

---

## 🎯 XULOSA

Ushbu reja bo'yicha ishlash orqali barcha ishlamayotgan funksiyalar hal qilinadi va dastur to'liq ishlaydigan holatga keladi. 

**Tavsiya:** Priority 1 va Priority 2 muammolarni darhol hal qilish, Priority 3 muammolarni keyinroq hal qilish mumkin.
