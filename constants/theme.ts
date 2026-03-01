/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */


import { Dimensions, Platform } from 'react-native';

export const COLORS = {
  background: '#F1ECE6',
  text: {
    primary: '#000000',
    secondary: '#A0A0A0',
    error: '#E1494B',
    success: '#4CAF50',
    inverse: '#FFFFFF',
  },
  button: {
    primary: '#000000',
    text: '#FFFFFF',
    disabled: '#A0A0A0',
  },
  input: {
    bg: '#FFFFFF',
    border: '#E5E5E5',
  }
};

export const LAYOUT = {
  window: Dimensions.get('window'),
  padding: 24,
  radius: {
    button: 100,
    card: 24,
    input: 16,
  }
};

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
    background: '#F1ECE6',
  text: {
    primary: '#000000',
    secondary: '#A0A0A0',
    error: '#E1494B',
    success: '#4CAF50',
    inverse: '#FFFFFF',
  },
  button: {
    primary: '#000000',
    text: '#FFFFFF',
    disabled: '#A0A0A0',
  },
  input: {
    bg: '#FFFFFF',
    border: '#E5E5E5',
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
