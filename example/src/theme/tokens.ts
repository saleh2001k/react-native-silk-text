export type ThemeMode = 'light' | 'dark';

export type ThemeColors = {
  bg: string;
  bgElevated: string;
  card: string;
  cardBorder: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  green: string;
  pink: string;
  amber: string;
  violet: string;
};

export const palettes: Record<ThemeMode, ThemeColors> = {
  dark: {
    bg: '#0A0A0F',
    bgElevated: '#101018',
    card: '#15151F',
    cardBorder: '#23232F',
    text: '#F5F5F7',
    textMuted: '#8A8A99',
    textFaint: '#5A5A6A',
    accent: '#6C8CFF',
    accentSoft: '#1E2440',
    onAccent: '#0A0A0F',
    green: '#42E2B8',
    pink: '#FF6CAB',
    amber: '#FFC56C',
    violet: '#B98CFF',
  },
  light: {
    bg: '#F4F4F8',
    bgElevated: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: '#E2E2EA',
    text: '#111118',
    textMuted: '#6B6B7B',
    textFaint: '#9A9AAA',
    accent: '#4F6BF6',
    accentSoft: '#E8ECFE',
    onAccent: '#FFFFFF',
    green: '#1FAF8A',
    pink: '#E85A9A',
    amber: '#D4922E',
    violet: '#8B5CF6',
  },
};
