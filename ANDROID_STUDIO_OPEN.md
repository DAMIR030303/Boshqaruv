# Android Studio'da Dasturni Ishga Tushirish

## 1. Android Studio'ni Ochish

### Variant A: Qo'lda ochish
1. Android Studio'ni oching
2. `File > Open` yoki `Open an Existing Project` tugmasini bosing
3. Quyidagi papkani tanlang:
   ```
   /home/damir/Cursor/Boshqaruv.uz/Boshqaruv/android
   ```
4. "OK" tugmasini bosing

### Variant B: Terminal orqali (agar Android Studio PATH'da bo'lsa)
```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
studio android/
```

Yoki:
```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv
android-studio android/
```

## 2. Gradle Sync

Android Studio ochilgandan keyin:
1. Gradle sync avtomatik boshlanadi
2. Agar sync muvaffaqiyatsiz bo'lsa, `File > Sync Project with Gradle Files` ni bosing
3. Sync tugaguncha kuting (pastki o'ng burchakda progress ko'rsatiladi)

## 3. Emulator yoki Real Device

### Emulator yaratish (agar yo'q bo'lsa):
1. `Tools > Device Manager` ni oching
2. `Create Device` tugmasini bosing
3. Device modelini tanlang (masalan: Pixel 5)
4. System image tanlang (masalan: Android 13 - API 33)
5. `Finish` tugmasini bosing

### Real Device ulash:
1. USB orqali telefoni ulang
2. Telefonda "USB debugging" ni yoqing:
   - `Settings > About phone`
   - `Build number` ni 7 marta bosing
   - `Settings > Developer options`
   - `USB debugging` ni yoqing
3. Android Studio'da device tanlang (yuqoridagi device selector'da)

## 4. Dasturni Ishga Tushirish

1. Yuqoridagi device selector'da device yoki emulator tanlang
2. `Run > Run 'app'` yoki `Shift + F10` tugmalarini bosing
3. Yoki yashil "Run" tugmasini (▶️) bosing

## 5. Loglarni Ko'rish

Dastur ishga tushgandan keyin:
1. `View > Tool Windows > Logcat` ni oching
2. Yoki pastki panelda "Logcat" tab'ni oching
3. Filter qo'shing: `boshqaruv|capacitor|error|ERROR`

## 6. Debug Mode

Debug mode'da ishga tushirish:
1. `Run > Debug 'app'` yoki `Shift + F9` tugmalarini bosing
2. Breakpoint qo'yish uchun kod satrining yonidagi qizil nuqtani bosing
3. Dastur breakpoint'ga kelganda to'xtaydi

## 7. Chrome DevTools (WebView Debugging)

1. Telefonda dasturni oching
2. Chrome'da `chrome://inspect` oching
3. "inspect" tugmasini bosing
4. Console'da JavaScript xatolarini ko'ring

## Muammolar

### Gradle sync xatosi:
```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv/android
./gradlew clean
```

### Build xatosi:
- `File > Invalidate Caches / Restart`
- `Invalidate and Restart` tugmasini bosing

### Device topilmayapti:
- USB debugging yoqilganini tekshiring
- USB kabli almashtiring
- `adb devices` orqali device ko'rinishini tekshiring

## Foydali Qisqa Yol

Terminal'da:
```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv/android
./gradlew assembleDebug
./gradlew installDebug
```

Bu APK'ni build qiladi va device'ga o'rnatadi.

