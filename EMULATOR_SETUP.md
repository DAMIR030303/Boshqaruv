# Android Emulator O'rnatish va Ishga Tushirish

## 1. Emulator Mavjudligini Tekshirish

### Terminal orqali:
```bash
# Emulator mavjudligini tekshirish
$ANDROID_HOME/emulator/emulator -list-avds

# Yoki
$HOME/Android/Sdk/emulator/emulator -list-avds
```

Agar emulator topilmasa, Android Studio orqali o'rnatish kerak.

## 2. Android Studio orqali Emulator Yaratish

### Qadam 1: Android Studio'ni oching
1. Android Studio'ni ishga tushiring
2. `Tools > Device Manager` ni oching

### Qadam 2: Virtual Device yaratish
1. `Create Device` tugmasini bosing
2. **Device modelini tanlang:**
   - Pixel 5 (tavsiya etiladi)
   - Pixel 6
   - Pixel 7
   - Yoki boshqa model

3. **System Image tanlang:**
   - Android 13 (API 33) - **Tavsiya etiladi**
   - Android 12 (API 31)
   - Android 11 (API 30)
   - "Download" tugmasini bosing agar image yo'q bo'lsa

4. **Device Configuration:**
   - Device nomini o'zgartirishingiz mumkin
   - `Finish` tugmasini bosing

### Qadam 3: Emulator'ni ishga tushirish
1. Device Manager'da yaratilgan device'ni tanlang
2. Yashil "Play" tugmasini (▶️) bosing
3. Emulator ochilguncha kuting (bir necha daqiqa)

## 3. Terminal orqali Emulator Ishga Tushirish

### Emulator'ni ishga tushirish:
```bash
# AVD ro'yxatini ko'rish
$ANDROID_HOME/emulator/emulator -list-avds

# Emulator'ni ishga tushirish (AVD nomini o'zgartiring)
$ANDROID_HOME/emulator/emulator -avd Pixel_5_API_33 &

# Yoki background'da ishga tushirish
nohup $ANDROID_HOME/emulator/emulator -avd Pixel_5_API_33 > /dev/null 2>&1 &
```

### Device'ni tekshirish:
```bash
adb devices
```

Device ko'rinishi kerak:
```
List of devices attached
emulator-5554    device
```

## 4. Dasturni Emulator'ga O'rnatish

### Android Studio orqali:
1. Device selector'da emulator'ni tanlang
2. `Run > Run 'app'` yoki `Shift + F10` tugmalarini bosing

### Terminal orqali:
```bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv/android
./gradlew installDebug
```

## 5. Emulator Sozlamalari

### Performance:
- **Graphics:** Automatic (tavsiya etiladi)
- **RAM:** 2048 MB yoki 4096 MB
- **VM heap:** 512 MB

### Network:
- Emulator avtomatik internetga ulanadi
- Localhost: `10.0.2.2` (host machine'ning localhost'i)

## 6. Muammolar va Yechimlar

### Emulator sekin ishlayapti:
1. **Hardware acceleration yoqing:**
   ```bash
   # KVM tekshirish (Linux)
   lsmod | grep kvm
   
   # Agar yo'q bo'lsa:
   sudo modprobe kvm
   sudo modprobe kvm_intel  # Intel uchun
   # yoki
   sudo modprobe kvm_amd     # AMD uchun
   ```

2. **Graphics mode'ni o'zgartiring:**
   - Emulator settings'da `Graphics: Hardware - GLES 2.0`

### Emulator ochilmayapti:
1. Android Studio'ni qayta ishga tushiring
2. `File > Invalidate Caches / Restart`
3. Emulator'ni qayta yarating

### ADB device topilmayapti:
```bash
# ADB server'ni qayta ishga tushirish
adb kill-server
adb start-server
adb devices
```

## 7. Tezkor Start Script

`start-emulator.sh` faylini yarating:
```bash
#!/bin/bash
cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv/android

# Emulator'ni ishga tushirish
$ANDROID_HOME/emulator/emulator -avd Pixel_5_API_33 &

# 30 soniya kutish (emulator ochilishi uchun)
sleep 30

# Device'ni tekshirish
adb devices

# Dasturni o'rnatish
./gradlew installDebug
```

Faylni executable qiling:
```bash
chmod +x start-emulator.sh
```

Ishga tushirish:
```bash
./start-emulator.sh
```

## 8. Foydali Qisqa Yollar

### Emulator'ni to'xtatish:
```bash
adb -s emulator-5554 emu kill
```

### Emulator'ni qayta ishga tushirish:
```bash
adb -s emulator-5554 reboot
```

### Loglarni ko'rish:
```bash
adb logcat | grep -i "boshqaruv\|capacitor\|error"
```

## 9. Android Studio'da Emulator Yaratish (Batafsil)

1. **Android Studio'ni oching**
2. **Welcome screen'da:**
   - `More Actions > Virtual Device Manager`
   - Yoki `Tools > Device Manager`

3. **Create Device:**
   - `+ Create Device` tugmasini bosing
   - Category: `Phone`
   - Device: `Pixel 5` (yoki boshqa)
   - `Next` tugmasini bosing

4. **System Image:**
   - `Release Name:` Android 13 (API 33)
   - `Download` tugmasini bosing (agar yo'q bo'lsa)
   - `Next` tugmasini bosing

5. **AVD Configuration:**
   - `AVD Name:` Pixel_5_API_33 (yoki boshqa nom)
   - `Finish` tugmasini bosing

6. **Emulator'ni ishga tushirish:**
   - Device Manager'da yaratilgan device'ni tanlang
   - Yashil "Play" tugmasini bosing

## 10. Dasturni Test Qilish

Emulator ochilgandan keyin:
1. Android Studio'da device selector'da emulator'ni tanlang
2. `Run > Run 'app'` yoki `Shift + F10`
3. Dastur emulator'da ochiladi
4. Loglarni `Logcat`'da ko'ring

