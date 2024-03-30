import { StatusBar, Style } from "@capacitor/status-bar";

// set status bar color
export const setStatusBarColor = async (color: string): Promise<void> => {
  await StatusBar.setBackgroundColor({ color });
};

// set status bar color to transparent
export const setStatusBarOverlaysWebView = async (): Promise<void> => {
  await StatusBar.setOverlaysWebView({ overlay: true });
};

// set status bar color to dark
export const setStatusBarStyleDark = async (): Promise<void> => {
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: "#000007" });
};

// set status bar color to light
export const setStatusBarStyleLight = async (): Promise<void> => {
  await StatusBar.setStyle({ style: Style.Light });
  await StatusBar.setBackgroundColor({ color: "#ffffff" });
};

// hide status bar
export const hideStatusBar = async (): Promise<void> => {
  await StatusBar.hide();
};

// show status bar
export const showStatusBar = async (): Promise<void> => {
  await StatusBar.show();
};
