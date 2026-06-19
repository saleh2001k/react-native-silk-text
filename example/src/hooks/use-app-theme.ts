import { palettes } from '../theme';
import { useThemeStore } from '../stores/theme-store';

export function useAppTheme() {
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const colors = palettes[mode];

  return {
    mode,
    colors,
    isDark: mode === 'dark',
    toggleMode,
  };
}
