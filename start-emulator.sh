#!/bin/bash

# Android Emulator va Dasturni Ishga Tushirish Script

echo "🚀 Emulator ishga tushirilmoqda..."

# Emulator'ni ishga tushirish
$ANDROID_HOME/emulator/emulator -avd navqurt_emulator -no-snapshot-load > /dev/null 2>&1 &

# Emulator ochilishini kutish
echo "⏳ Emulator ochilishini kutmoqda (30 soniya)..."
sleep 30

# Device'ni tekshirish
echo "📱 Device'lar ro'yxati:"
adb devices

# Device topilganini tekshirish
if adb devices | grep -q "emulator.*device"; then
    echo "✅ Emulator muvaffaqiyatli ishga tushdi!"
    
    # Dasturni o'rnatish
    echo "📦 Dastur o'rnatilmoqda..."
    cd /home/damir/Cursor/Boshqaruv.uz/Boshqaruv/android
    ./gradlew installDebug
    
    echo "✅ Dastur muvaffaqiyatli o'rnatildi!"
    echo "📱 Emulator'da dasturni oching"
else
    echo "❌ Emulator hali ochilmadi. Iltimos, kuting..."
    echo "💡 Emulator'ni qo'lda ochish uchun:"
    echo "   $ANDROID_HOME/emulator/emulator -avd navqurt_emulator"
fi

