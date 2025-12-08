# 🚀 Tez APK Yaratish

## 1-qadam: Build Web App

```bash
pnpm build
```

## 2-qadam: Android'ga Sync

```bash
pnpm android:build
```

## 3-qadam: APK Yaratish

### Variant A: Android Studio (Tavsiya etiladi)

```bash
# Android Studio'ni ochish
pnpm android:open
```

Keyin Android Studio'da:
1. Gradle sync kuting
2. `Build > Build Bundle(s) / APK(s) > Build APK(s)`
3. APK: `android/app/build/outputs/apk/debug/app-debug.apk`

### Variant B: Command Line

```bash
cd android
./gradlew assembleDebug
```

APK joylashuvi:
- `android/app/build/outputs/apk/debug/app-debug.apk`

## 4-qadam: APK'ni Test Qilish

```bash
# USB orqali device'ga o'rnatish
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Yoki APK'ni device'ga ko'chirib, o'rnating
```

## 📱 Release APK (Google Play uchun)

Release APK uchun keystore kerak:

```bash
# 1. Keystore yaratish
keytool -genkey -v -keystore android/app/release.keystore \
  -alias boshqaruv -keyalg RSA -keysize 2048 -validity 10000

# 2. android/app/build.gradle'da signingConfigs'ni sozlang

# 3. Release APK build
cd android
./gradlew assembleRelease
```

## ⚡ Eng Tez Usul

```bash
# Barcha qadamlarni bir vaqtda
pnpm build && pnpm android:build && cd android && ./gradlew assembleDebug
```

APK: `android/app/build/outputs/apk/debug/app-debug.apk`

