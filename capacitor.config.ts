import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.kwakol.funds.mobile',
  appName: 'Kwakol Funds',
  webDir: 'www',
  bundledWebRuntime: false,
  cordova: {},
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 3000,
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true,
    },
  }
};

export default config;
