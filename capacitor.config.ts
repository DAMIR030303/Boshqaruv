import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'uz.boshqaruv.app',
  appName: 'Boshqaruv',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Development uchun localhost
    // url: 'http://localhost:3000',
    // cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB', // AAB (Google Play) yoki APK
    },
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // WebView optimizatsiyalari
    backgroundColor: '#f9fafb',
    hideScrollbars: false,
    // JavaScript'ni yoqish (default true, lekin aniq qilish)
    javascriptEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#2563eb',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#2563eb',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;

