# Real-time Status Ko'rsatkich

## 📊 Real-time Status Indicator

Dastur header'ida Supabase real-time connection holatini ko'rsatadigan status ko'rsatkich mavjud.

### 🟢 Yashil (Real-time ishlayapti)
- Supabase real-time connection muvaffaqiyatli
- Barcha jadvallar real-time rejimda ishlayapti
- O'zgarishlar avtomatik yangilanadi

### 🔴 Qizil (Real-time ishlamayapti)
- Supabase real-time connection xatosi
- Real-time yangilanishlar ishlamayapti
- Ma'lumotlar faqat manual refresh bilan yangilanadi

## 📍 Qayerda Ko'rinadi

Real-time status ko'rsatkich header'ning chap tomonida, logo yonida ko'rinadi:

```
[Logo] Boshqaruv [🟢 RT] [Search] [Notifications] [Theme] [Profile]
```

## 🔧 Qanday Ishlaydi

1. **Avtomatik Tekshirish:**
   - Dastur ishga tushganda avtomatik tekshiriladi
   - Har 30 soniyada qayta tekshiriladi

2. **Test Channel:**
   - `tasks` jadvaliga test subscription yaratiladi
   - Subscription muvaffaqiyatli bo'lsa → Yashil
   - Subscription xatosi bo'lsa → Qizil

3. **Status Yangilanishi:**
   - Connection holati o'zgarganda avtomatik yangilanadi
   - Visual feedback (pulse animation) yashil holatda

## 🎨 Dizayn

### Yashil Holat
- **Background:** `bg-green-100 dark:bg-green-900/30`
- **Text:** `text-green-500`
- **Icon:** Wifi icon + pulse animation
- **Text:** "RT" (Real-time)

### Qizil Holat
- **Background:** `bg-red-100 dark:bg-red-900/30`
- **Text:** `text-red-500`
- **Icon:** WifiOff icon
- **Text:** "RT" (Real-time)

## 🔍 Tekshirish

### Browser Console'da
```javascript
// Real-time connection tekshirish
console.log('Supabase configured:', isSupabaseConfigured());

// Channel holatini ko'rish
const channel = supabase.channel('test');
channel.subscribe((status) => {
  console.log('Channel status:', status);
});
```

### Network Tab'da
- WebSocket connection ko'rinishi kerak
- `wss://*.supabase.co/realtime/v1/websocket` URL'da

## 🐛 Muammo Bo'lsa

### Qizil Ko'rsatkich

1. **Supabase sozlamalarini tekshiring:**
   - `.env` faylida `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` to'g'ri ekanligini
   - Supabase Dashboard'da loyiha faol ekanligini

2. **Network tekshirish:**
   - Browser DevTools → Network → WS (WebSocket)
   - WebSocket connection mavjudligini tekshiring

3. **RLS Policy'lar:**
   - Supabase Dashboard → Authentication → Policies
   - Barcha jadvallar uchun policy'lar mavjudligini tekshiring

4. **Realtime Publication:**
   - Supabase Dashboard → Database → Publications
   - `supabase_realtime` publication'da jadvallar qo'shilganini tekshiring

## 📝 Kod

### Komponent
```tsx
import { RealtimeStatus } from './components/mobile/RealtimeStatus';

// Header'da
<RealtimeStatus />
```

### Hook
```tsx
import { useRealtime } from './hooks/useRealtime';

const { connected, error } = useRealtime('tasks', {
  onUpdate: (data) => {
    console.log('Real-time yangilanish:', data);
  }
});
```

## ✅ Xususiyatlar

- ✅ Avtomatik tekshirish
- ✅ Visual feedback (yashil/qizil)
- ✅ Pulse animation (yashil holatda)
- ✅ Tooltip (hover'da batafsil ma'lumot)
- ✅ Responsive dizayn
- ✅ Dark mode qo'llab-quvvatlash

---

**Real-time status ko'rsatkich tayyor! 🎉**

