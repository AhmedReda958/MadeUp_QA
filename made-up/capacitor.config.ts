import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madeup.app",
  appName: "MadeUp",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    LiveUpdates: {
      appId: "07d4403d",
      channel: "Production",
      autoUpdateMethod: "background",
      maxVersions: 2,
    },
  },
};

export default config;
