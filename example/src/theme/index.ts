import { Platform } from 'react-native';

export { palettes, type ThemeColors, type ThemeMode } from './tokens';

export const spacing = (n: number) => n * 8;

export const radius = { sm: 10, md: 16, lg: 22, pill: 999 };

export const fonts = {
  system: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  })!,
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  })!,
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  })!,
};
