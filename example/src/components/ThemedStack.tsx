import { useAppTheme } from '../hooks/use-app-theme';

export function useStackScreenOptions() {
  const { colors } = useAppTheme();

  return {
    headerStyle: { backgroundColor: colors.bg },
    headerTintColor: colors.text,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.bg },
  };
}
