import { Platform } from 'react-native';

export const theme = {
  bg: '#0B0B0F',
  card: '#16161D',
  cardBorder: '#26262F',
  text: '#F5F5F7',
  textMuted: '#9A9AA6',
  accent: '#6C8CFF',
  accentSoft: '#2A2F4A',
  pink: '#FF6CAB',
  green: '#42E2B8',
  amber: '#FFC56C',
};

export const spacing = (n: number) => n * 8;

/** Cross-platform font family names that ship with the OS. */
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
  rounded: Platform.select({
    ios: 'Avenir Next',
    android: 'sans-serif-medium',
    default: 'System',
  })!,
  cursive: Platform.select({
    ios: 'Snell Roundhand',
    android: 'cursive',
    default: 'System',
  })!,
};
