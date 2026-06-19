import { type ReactNode, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '../hooks/use-app-theme';
import { radius, spacing } from '../theme';
import { ThemeToggle } from './ThemeToggle';

export function Screen({
  title,
  kicker,
  accent,
  children,
}: {
  title: string;
  kicker?: string;
  accent?: string;
  children: ReactNode;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const accentColor = accent ?? colors.accent;

  return (
    <View style={styles.screen} collapsable={false}>
      <View style={styles.header}>
        <ThemeToggle />
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {kicker ? (
          <Text style={[styles.kicker, { color: accentColor }]}>{kicker}</Text>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        <View style={{ height: spacing(2.5) }} />
        {children}
        <View style={{ height: spacing(4) }} />
      </ScrollView>
    </View>
  );
}

export function Card({
  children,
  style,
  onPress,
  glow,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  glow?: string;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const Comp: any = onPress ? Pressable : View;

  return (
    <Comp
      onPress={onPress}
      style={[
        styles.card,
        glow
          ? { borderColor: glow, shadowColor: glow, shadowOpacity: 0.25 }
          : null,
        style,
      ]}
    >
      {children}
    </Comp>
  );
}

export function Pill({
  label,
  active,
  onPress,
  accent,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  accent?: string;
}) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const accentColor = accent ?? colors.accent;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.pill, active ? { backgroundColor: accentColor } : null]}
    >
      <Text
        style={[
          styles.pillLabel,
          active ? { color: colors.onAccent } : { color: colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Label({ children }: { children: ReactNode }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return <Text style={styles.label}>{children}</Text>;
}

export function Row({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {children}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>['colors']) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    header: {
      position: 'absolute',
      top: spacing(6),
      right: spacing(2.5),
      zIndex: 10,
    },
    scroll: {
      paddingHorizontal: spacing(2.5),
      paddingTop: spacing(8),
      paddingBottom: spacing(2),
    },
    kicker: {
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    },
    title: {
      color: colors.text,
      fontSize: 34,
      fontWeight: '800',
      marginTop: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.cardBorder,
      padding: spacing(2.5),
      marginBottom: spacing(2),
      shadowOffset: { width: 0, height: 8 },
      shadowRadius: 18,
      shadowOpacity: 0.08,
    },
    pill: {
      backgroundColor: colors.accentSoft,
      paddingHorizontal: spacing(2),
      paddingVertical: spacing(1),
      borderRadius: radius.pill,
    },
    pillLabel: { fontSize: 14, fontWeight: '700' },
    label: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  });
}
