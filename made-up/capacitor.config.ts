import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madeup.app",
  appName: "MadeUp",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
