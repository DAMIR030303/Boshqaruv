# Real-time Rejim Sozlamalari

## ✅ Bajarilgan Ishlar

1. ✅ Supabase client'da realtime sozlamalari yaxshilandi
2. ✅ `useRealtime` hook yaratildi - bitta yozuvni kuzatish uchun
3. ✅ `useRealtimeList` hook yaratildi - ro'yxatni kuzatish uchun
4. ✅ Services'larda realtime subscription metodlari qo'shildi:
   - ✅ `TaskService.subscribeToTasks()`
   - ✅ `AttendanceService.subscribeToAttendance()`
   - ✅ `ShiftService.subscribeToShifts()`
   - ✅ `PenaltyService.subscribeToPenalties()`

## 🚀 Qanday Ishlatish

### 1. Hook orqali (Tavsiya etiladi)

#### Bitta yozuvni kuzatish:

```tsx
import { useRealtime } from '../hooks/useRealtime';
import type { Task } from '../types';

function TaskDetail({ taskId }: { taskId: string }) {
  const { data, loading, error, connected } = useRealtime<Task>('tasks', {
    filter: `id=eq.${taskId}`,
    onUpdate: (updatedTask) => {
      console.log('Vazifa yangilandi:', updatedTask);
      toast.success('Vazifa yangilandi');
    }
  });

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xato: {error}</div>;
  if (!data) return <div>Vazifa topilmadi</div>;

  return (
    <div>
      <h1>{data.title}</h1>
      <p>Status: {connected ? '✅ Ulangan' : '❌ Ulanmagan'}</p>
    </div>
  );
}
```

#### Ro'yxatni kuzatish:

```tsx
import { useRealtimeList } from '../hooks/useRealtime';
import type { Task } from '../types';

function TaskList() {
  const { data, loading, error, connected } = useRealtimeList<Task[]>('tasks', {
    filter: 'status=eq.pending',
    orderBy: 'created_at',
    orderAscending: false
  });

  if (loading) return <div>Yuklanmoqda...</div>;
  if (error) return <div>Xato: {error}</div>;

  return (
    <div>
      <p>Status: {connected ? '✅ Real-time ulangan' : '❌ Ulanmagan'}</p>
      <ul>
        {data.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. Service orqali

```tsx
import { useEffect, useState } from 'react';
import { TaskService } from '../services/taskService';
import type { Task } from '../types';

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Dastlabki ma'lumotlarni yuklash
    TaskService.getTasks().then(result => {
      if (result.success && result.data) {
        setTasks(result.data);
      }
    });

    // Real-time subscription
    const unsubscribe = TaskService.subscribeToTasks(undefined, {
      onInsert: (newTask) => {
        setTasks(prev => [newTask, ...prev]);
        toast.success('Yangi vazifa qo\'shildi');
      },
      onUpdate: (updatedTask) => {
        setTasks(prev =>
          prev.map(task =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        toast.info('Vazifa yangilandi');
      },
      onDelete: (deletedTask) => {
        setTasks(prev => prev.filter(task => task.id !== deletedTask.id));
        toast.warning('Vazifa o\'chirildi');
      }
    });

    // Cleanup
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

## 📋 Real-time Ishlaydigan Jadvalar

Quyidagi jadvallar real-time rejimda ishlaydi:

- ✅ `tasks` - Vazifalar
- ✅ `attendance` - Davomat
- ✅ `shifts` - Smenalar
- ✅ `penalties` - Jarimalar
- ✅ `kpi` - KPI ma'lumotlari
- ✅ `reports` - Hisobotlar
- ✅ `marketing_tasks` - Marketing vazifalari
- ✅ `instagram_posts` - Instagram postlari
- ✅ `video_projects` - Video loyihalar
- ✅ `marketing_kpi` - Marketing KPI
- ✅ `content_monitoring` - Kontent monitoring
- ✅ `ai_content_logs` - AI kontent loglari

## 🔍 Tekshirish

Real-time ishlayotganini tekshirish uchun:

1. **Browser Console'da:**
   - `✅ Real-time subscription yaratildi: tasks` xabari ko'rinishi kerak

2. **Supabase Dashboard'da:**
   - **Database** → **Publications** → `supabase_realtime`
   - Barcha jadvallar qo'shilganini tekshiring

3. **Dasturda:**
   - Bir tab'da ma'lumot yarating/yangilang
   - Boshqa tab'da avtomatik yangilanishini ko'ring

## ⚙️ Sozlamalar

### Supabase Client

```typescript
// src/utils/supabaseClient.ts
export const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 10 // Sekundiga maksimal eventlar soni
    }
  }
});
```

### Realtime Hook

```typescript
// src/hooks/useRealtime.ts
const { data, loading, error, connected } = useRealtime('tasks', {
  filter: 'status=eq.pending', // Filter (ixtiyoriy)
  enabled: true, // Subscription'ni yoqish/o'chirish
  onInsert: (data) => {}, // INSERT event handler
  onUpdate: (data) => {}, // UPDATE event handler
  onDelete: (data) => {}  // DELETE event handler
});
```

## 🐛 Muammo Bo'lsa

1. **Subscription ulanmayapti:**
   - Supabase Dashboard → **Database** → **Publications** da jadvallar qo'shilganini tekshiring
   - Browser console'da xatolarni ko'ring
   - `.env` faylida Supabase sozlamalari to'g'ri ekanligini tekshiring

2. **O'zgarishlar yangilanmayapti:**
   - RLS policy'lar to'g'ri sozlanganini tekshiring
   - Subscription connected holatda ekanligini tekshiring
   - Network tab'da WebSocket ulanishini tekshiring

3. **Performance muammolari:**
   - `eventsPerSecond` ni kamaytiring
   - Filter'lardan foydalaning
   - Faqat kerakli jadvallarni kuzating

## 📝 Keyingi Qadamlar

1. Component'larda realtime hook'larni ishlatish
2. Real-time yangilanishlarni UI'da ko'rsatish
3. Optimistic updates qo'shish
4. Error handling yaxshilash

---

**Real-time rejim tayyor! 🎉**

