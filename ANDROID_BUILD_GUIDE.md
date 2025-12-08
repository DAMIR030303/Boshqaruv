# Android APK Build Guide

## 📱 Android APK Yaratish

### Talablar

1. **Java JDK 17+** (yoki 11+)
2. **Android Studio** (yoki faqat Android SDK)
3. **Gradle** (avtomatik o'rnatiladi)

### 1. Build Script

```bash
# Production build
pnpm android:build

# Android Studio'da ochish
pnpm android:open
```

### 2. Android Studio orqali Build

1. Android Studio'ni oching
2. `File > Open` → `android` papkasini tanlang
3. Gradle sync kuting
4. `Build > Build Bundle(s) / APK(s) > Build APK(s)`
5. APK fayl: `android/app/build/outputs/apk/release/app-release.apk`

### 3. Command Line orqali Build

```bash
# Debug APK
cd android
./gradlew assembleDebug

# Release APK (signing kerak)
./gradlew assembleRelease

# APK joylashuvi:
# android/app/build/outputs/apk/debug/app-debug.apk
# android/app/build/outputs/apk/release/app-release.apk
```

### 4. Release APK uchun Signing

Release APK yaratish uchun keystore kerak:

```bash
# Keystore yaratish
keytool -genkey -v -keystore release.keystore -alias boshqaruv -keyalg RSA -keysize 2048 -validity 10000

# Keystore'ni android/app/ papkasiga ko'chiring
# android/app/build.gradle'da signingConfigs'ni sozlang
```

### 5. APK O'lchami Optimizatsiyasi

APK o'lchamini kamaytirish uchun:

1. **ProGuard** - minifyEnabled: true (hozir sozlangan)
2. **Split APKs** - ABI va density bo'yicha
3. **App Bundle (AAB)** - Google Play uchun (tavsiya etiladi)

### 6. Test Qilish

```bash
# Emulator'da test
pnpm android:open
# Android Studio'da emulator'ni ishga tushiring

# Real device'da test
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### 7. APK Joylashuvi

Build qilingan APK fayllar:
- **Debug:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release:** `android/app/build/outputs/apk/release/app-release.apk`

### 8. Google Play Store uchun AAB

```bash
cd android
./gradlew bundleRelease

# AAB joylashuvi:
# android/app/build/outputs/bundle/release/app-release.aab
```

## 🔧 Konfiguratsiya

### App ID
- **Package:** `uz.boshqaruv.app`
- **Version:** `1.0` (versionCode: 1)

### Permissions
- Internet
- Camera (ixtiyoriy)
- Location (ixtiyoriy)
- Network State

### Minimum SDK
- **minSdkVersion:** 22 (Android 5.1)
- **targetSdkVersion:** 34 (Android 14)

## 📝 Eslatmalar

1. **Keystore** - Release APK uchun kerak (Google Play'ga yuklash uchun)
2. **ProGuard** - Release build'da minify qilinadi
3. **Permissions** - Camera va Location ixtiyoriy (required="false")
4. **Build Time** - Birinchi build 5-10 daqiqa olishi mumkin

## 🚀 Tez Start

```bash
# 1. Build web app
pnpm build

# 2. Sync Android
pnpm android:build

# 3. Android Studio'da ochish
pnpm android:open

# 4. Build APK (Android Studio'da)
# Build > Build Bundle(s) / APK(s) > Build APK(s)
```

## 🐛 Muammolar

### Gradle Build Error
```bash
# Gradle wrapper'ni yangilash
cd android
./gradlew wrapper --gradle-version=8.0
```

### Java Version Error
```bash
# Java 17+ kerak
java -version
# Agar yo'q bo'lsa, Java 17 o'rnating
```

### SDK Error
```bash
# Android SDK'ni tekshirish
# Android Studio > SDK Manager
# Android SDK Platform 34 o'rnatilgan bo'lishi kerak
```

