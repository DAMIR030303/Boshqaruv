# Mobile PWA Setup Guide

## 📱 PWA Features

### ✅ Implemented Features

1. **Web App Manifest** (`/public/manifest.json`)
   - App name va description
   - Icons (192x192, 512x512)
   - Theme color
   - Display mode: standalone
   - Shortcuts (Yangi vazifa, Davomat)

2. **Service Worker** (`/public/sw.js`)
   - Offline support
   - Cache management
   - Network-first strategy
   - Background sync ready
   - Push notification ready

3. **iOS Meta Tags** (`/index.html`)
   - `apple-mobile-web-app-capable`
   - `apple-mobile-web-app-status-bar-style`
   - `apple-mobile-web-app-title`
   - Apple touch icons
   - Viewport-fit=cover

4. **PWA Utilities** (`/src/utils/pwa.ts`)
   - Service Worker registration
   - Install prompt handling
   - Online/Offline detection
   - PWA state checking

5. **Mobile Optimizations**
   - Touch-friendly elements (44px minimum)
   - Safe area insets support
   - Prevent zoom on input focus
   - Smooth scrolling
   - Pull-to-refresh component (ready)

## 🎨 Icon Requirements

Quyidagi icon fayllarini `/public` papkasiga qo'shish kerak:

### Required Icons:
- `/public/icon-192x192.png` - 192x192px
- `/public/icon-512x512.png` - 512x512px
- `/public/apple-touch-icon.png` - 180x180px
- `/public/apple-touch-icon-152x152.png` - 152x152px
- `/public/apple-touch-icon-120x120.png` - 120x120px
- `/public/apple-touch-icon-76x76.png` - 76x76px
- `/public/apple-touch-icon-60x60.png` - 60x60px
- `/public/favicon-32x32.png` - 32x32px
- `/public/favicon-16x16.png` - 16x16px
- `/public/safari-pinned-tab.svg` - SVG format
- `/public/mstile-150x150.png` - 150x150px (Windows)

### Icon Design Guidelines:
- Background: #2563eb (Primary blue)
- Icon: White logo or symbol
- Rounded corners: 20% (for maskable icons)
- Padding: 10% on all sides

## 🚀 Testing PWA

### Chrome DevTools:
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" section
4. Check "Service Workers" section
5. Test "Add to Home Screen"

### Mobile Testing:
1. Open on mobile browser
2. Look for "Add to Home Screen" prompt
3. Install and test offline mode
4. Check safe area insets (notch support)

### Lighthouse:
```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000 --view
```

Target scores:
- PWA: 100
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 📝 Next Steps

1. **Create Icons**: Generate all required icon sizes
2. **Test Offline**: Verify offline functionality
3. **Test Install**: Test "Add to Home Screen" on iOS and Android
4. **Optimize Cache**: Fine-tune service worker cache strategy
5. **Add Pull-to-Refresh**: Integrate PullToRefresh component in dashboard

## 🔧 Configuration

### Service Worker Update:
Service worker avtomatik yangilanadi. Yangi versiya chiqganda:
1. Service worker yangi versiyani yuklaydi
2. Eski versiya ishlaydi
3. Yangi versiya "waiting" holatida
4. Foydalanuvchi sahifani yangilaganda yangi versiya aktiv bo'ladi

### Cache Strategy:
- **Static assets**: Cache-first
- **API requests**: Network-first, fallback to cache
- **Images**: Cache-first with expiration

## 📱 Platform Support

- ✅ iOS Safari 14+
- ✅ Chrome Mobile 90+
- ✅ Samsung Internet
- ✅ Firefox Mobile
- ✅ Edge Mobile

## 🐛 Known Issues

- Icon fayllar hali yaratilmagan (placeholder)
- Pull-to-refresh komponenti yaratilgan, lekin integratsiya qilinmagan
- Background sync hali to'liq implement qilinmagan

