# 📊 ANALYTICS INTEGRATION GUIDE

**Sana:** 2024-12-09  
**Versiya:** 1.0.0

---

## 🎯 ANALYTICS OVERVIEW

Analytics platformalari:
1. ✅ Google Analytics 4 (GA4) - Website analytics
2. ✅ Vercel Analytics - Performance tracking
3. ✅ Custom Event Tracking - Custom events

---

## 📈 GOOGLE ANALYTICS 4 SETUP

### 1. Create GA4 Property

1. https://analytics.google.com oching
2. Admin → Create Property
3. Property name: "Boshqaruv.uz"
4. Time zone: Uzbekistan
5. Currency: UZS
6. Create → Web stream
7. Website URL: https://boshqaruv.uz
8. Stream name: "Boshqaruv Web"

**Copy:** Measurement ID (G-XXXXXXXXXX)

---

### 2. Install Package

```bash
pnpm add react-ga4
```

---

### 3. Create Analytics Utility

Fayl yarating: `src/utils/analytics.ts`

```typescript
import ReactGA from 'react-ga4';

/**
 * Analytics configuration
 */
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/**
 * Initialize Google Analytics
 */
export const initializeAnalytics = () => {
  if (!MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not found');
    return;
  }

  // Production only
  if (import.meta.env.PROD) {
    ReactGA.initialize(MEASUREMENT_ID, {
      gaOptions: {
        siteSpeedSampleRate: 100
      }
    });
    console.log('✅ Google Analytics initialized');
  }
};

/**
 * Track page view
 */
export const trackPageView = (path: string, title?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title
    });
  }
};

/**
 * Track event
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category,
      action,
      label,
      value
    });
  }
};

/**
 * Track user
 */
export const setUser = (userId: string) => {
  if (import.meta.env.PROD) {
    ReactGA.set({ userId });
  }
};

/**
 * Common events
 */
export const analytics = {
  // Authentication
  login: (method: string) => {
    trackEvent('Authentication', 'Login', method);
  },
  logout: () => {
    trackEvent('Authentication', 'Logout');
  },
  
  // Tasks
  taskCreated: (taskId: string) => {
    trackEvent('Tasks', 'Create', taskId);
  },
  taskUpdated: (taskId: string) => {
    trackEvent('Tasks', 'Update', taskId);
  },
  taskDeleted: (taskId: string) => {
    trackEvent('Tasks', 'Delete', taskId);
  },
  taskCompleted: (taskId: string) => {
    trackEvent('Tasks', 'Complete', taskId);
  },
  
  // Employees
  employeeCreated: (employeeId: string) => {
    trackEvent('Employees', 'Create', employeeId);
  },
  employeeUpdated: (employeeId: string) => {
    trackEvent('Employees', 'Update', employeeId);
  },
  
  // Reports
  reportGenerated: (reportType: string) => {
    trackEvent('Reports', 'Generate', reportType);
  },
  reportExported: (reportType: string, format: string) => {
    trackEvent('Reports', 'Export', `${reportType}-${format}`);
  },
  
  // Search
  searchPerformed: (query: string) => {
    trackEvent('Search', 'Query', query);
  },
  
  // UI Interactions
  featureUsed: (feature: string) => {
    trackEvent('Features', 'Use', feature);
  },
  buttonClicked: (buttonName: string) => {
    trackEvent('UI', 'Button Click', buttonName);
  },
  
  // Settings
  languageChanged: (language: string) => {
    trackEvent('Settings', 'Language', language);
  },
  themeChanged: (theme: string) => {
    trackEvent('Settings', 'Theme', theme);
  },
  
  // Feedback
  feedbackSubmitted: (type: string, rating?: number) => {
    trackEvent('Feedback', 'Submit', type, rating);
  }
};
```

---

### 4. Initialize in App.tsx

```typescript
// src/App.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeAnalytics, trackPageView } from './utils/analytics';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics
    initializeAnalytics();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    // ... your app
  );
}
```

---

### 5. Environment Variable

`.env.production`:
```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Vercel/Netlify Environment Variables:
```
VITE_GA_MEASUREMENT_ID → G-XXXXXXXXXX
```

---

### 6. Usage Example

```typescript
// In your components
import { analytics } from '../utils/analytics';

const handleLogin = async () => {
  await loginUser();
  analytics.login('email');
};

const handleTaskCreate = async (task) => {
  const newTask = await createTask(task);
  analytics.taskCreated(newTask.id);
};

const handleLanguageChange = (lang) => {
  setLanguage(lang);
  analytics.languageChanged(lang);
};
```

---

## 📊 VERCEL ANALYTICS

### Setup (Automatic)

Vercel Analytics avtomatik ishlaydi!

1. Vercel Dashboard → Analytics tab
2. Enable Analytics

**Metrics:**
- Page views
- Visitors (unique)
- Web Vitals (LCP, FID, CLS)
- Top pages
- Geographic data

---

### Custom Web Vitals Tracking

```typescript
// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals() {
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
}
```

---

## 🎨 CUSTOM EVENTS TRACKING

### Feedback Events

```typescript
// src/components/mobile/FeedbackWidget.tsx
import { analytics } from '../../utils/analytics';

const handleSubmit = async (feedback: FeedbackData) => {
  await sendFeedback(feedback);
  analytics.feedbackSubmitted(feedback.type, feedback.rating);
};
```

### Success Animation Events

```typescript
// src/components/ui/SuccessAnimation.tsx
import { analytics } from '../../utils/analytics';

export function SuccessAnimation({ message, variant }: Props) {
  useEffect(() => {
    if (isVisible) {
      analytics.featureUsed(`success-animation-${variant}`);
    }
  }, [isVisible, variant]);
  
  // ...
}
```

### Onboarding Events

```typescript
// src/components/mobile/OnboardingFlow.tsx
import { analytics } from '../../utils/analytics';

const handleComplete = () => {
  analytics.featureUsed('onboarding-completed');
  onComplete();
};

const handleSkip = () => {
  analytics.featureUsed('onboarding-skipped');
  onSkip();
};
```

---

## 📈 ANALYTICS DASHBOARD

### Google Analytics 4 Dashboard

**Key Metrics:**
1. **Realtime** - Active users
2. **Acquisition** - Traffic sources
3. **Engagement** - Page views, sessions
4. **Retention** - Returning users
5. **Events** - Custom event tracking

**Custom Reports:**
- Most used features
- Task creation rate
- User flow
- Conversion funnel

---

### Vercel Analytics Dashboard

**Metrics:**
- Real-time visitors
- Page views (top pages)
- Web Vitals:
  - LCP (Largest Contentful Paint) - <2.5s
  - FID (First Input Delay) - <100ms
  - CLS (Cumulative Layout Shift) - <0.1
- Geographic distribution
- Device breakdown

---

## 🔒 PRIVACY & GDPR

### Cookie Consent

```typescript
// src/components/CookieConsent.tsx
import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
    // Initialize analytics
    initializeAnalytics();
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50">
      <p>Biz cookie'lardan foydalanamiz...</p>
      <button onClick={handleAccept}>Qabul qilish</button>
    </div>
  );
}
```

---

## 🎯 KEY METRICS TO TRACK

### User Engagement
- ✅ Daily Active Users (DAU)
- ✅ Monthly Active Users (MAU)
- ✅ Session duration
- ✅ Pages per session
- ✅ Bounce rate

### Feature Usage
- ✅ Tasks created/completed per day
- ✅ Employees added per week
- ✅ Reports generated per month
- ✅ Search queries
- ✅ Dark mode usage %

### Performance
- ✅ Page load time (LCP < 2.5s)
- ✅ First Input Delay (FID < 100ms)
- ✅ Cumulative Layout Shift (CLS < 0.1)

### Conversion
- ✅ Onboarding completion rate
- ✅ Feature adoption rate
- ✅ User retention rate

---

## 📊 ANALYTICS DATA STRUCTURE

### Event Schema

```typescript
interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_action: string;
  event_label?: string;
  event_value?: number;
  user_id?: string;
  timestamp: string;
  page_path: string;
  page_title: string;
}
```

---

## ✅ ANALYTICS CHECKLIST

- [ ] Google Analytics 4 property created
- [ ] react-ga4 package installed
- [ ] analytics.ts utility created
- [ ] App.tsx initialized analytics
- [ ] Environment variables configured
- [ ] Custom events implemented
- [ ] Vercel Analytics enabled
- [ ] Privacy policy updated
- [ ] Cookie consent added (optional)
- [ ] Test analytics in production

---

**Status:** ✅ Analytics guide tayyor!  
**Next:** Deploy va analytics'ni production'da test qiling!
