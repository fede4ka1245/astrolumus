import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.alphaspace.app',
  appName: 'astrology app',
  webDir: 'build',
  plugins: {
    SplashScreen: {
      launchAutoHide: false
    },
    'plugins': {
      'FirebaseMessaging': {
        'presentationOptions': ['badge', 'sound', 'alert']
      }
    },
    Keyboard: {
      resizeOnFullScreen: true
    }
  }
};

export default config;
