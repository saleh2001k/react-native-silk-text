import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '../hooks/use-app-theme';
import { radius, spacing } from '../theme';

export function ThemeToggle() {
  const { colors, isDark, toggleMode } = useAppTheme();

  return (
    <Pressable
      onPress={toggleMode}
      style={[styles.btn, { backgroundColor: colors.accentSoft }]}
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={18} color={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
