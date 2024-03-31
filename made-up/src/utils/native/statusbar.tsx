import { StatusBar, Style } from "@capacitor/status-bar";
import { isPlatform } from "@ionic/react";

// set status bar color
export const setStatusBarColor = async (color: string): Promise<void> => {
  if (!isPlatform("cordova")) return;
  await StatusBar.setBackgroundColor({ color });
};

// set status bar color to transparent
export const setStatusBarOverlaysWebView = async (): Promise<void> => {
  if (!isPlatform("cordova")) return;
  await StatusBar.setOverlaysWebView({ overlay: true });
};

// set status bar color to dark
export const setStatusBarStyleDark = async (): Promise<void> => {
  if (!isPlatform("cordova")) return;
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: "#000007" });
};

// set status bar color to light
export const setStatusBarStyleLight = async (): Promise<void> => {
  if (!isPlatform("cordova")) return;
  await StatusBar.setStyle({ style: Style.Light });
  await StatusBar.setBackgroundColor({ color: "#ffffff" });
};

// hide status bar
export const hideStatusBar = async (): Promise<void> => {
  if (!isPlatform("cordova")) return;
  await StatusBar.hide();
};

// show status bar
export const showStatusBar = async (): Promise<void> => {
  if (!isPlatform("cordova")) return;
  await StatusBar.show();
};
