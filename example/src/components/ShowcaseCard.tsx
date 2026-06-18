import { type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, theme } from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  hint?: string;
  onReplay?: () => void;
  children: ReactNode;
};

export function ShowcaseCard({
  title,
  subtitle,
  hint,
  onReplay,
  children,
}: Props) {
  return (
    <Pressable onPress={onReplay} style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onReplay ? (
          <View style={styles.replay}>
            <Text style={styles.replayLabel}>Replay ↻</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.stage}>{children}</View>

      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.cardBorder,
    padding: spacing(2),
    marginBottom: spacing(2),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing(1.5),
  },
  headerText: { flex: 1, paddingRight: spacing(1) },
  title: { color: theme.text, fontSize: 16, fontWeight: '700' },
  subtitle: { color: theme.textMuted, fontSize: 13, marginTop: 2 },
  replay: {
    backgroundColor: theme.accentSoft,
    paddingHorizontal: spacing(1.25),
    paddingVertical: spacing(0.5),
    borderRadius: 999,
  },
  replayLabel: { color: theme.accent, fontSize: 12, fontWeight: '600' },
  stage: {
    justifyContent: 'center',
    paddingVertical: spacing(1),
  },
  hint: { color: theme.textMuted, fontSize: 12, marginTop: spacing(1.5) },
});
