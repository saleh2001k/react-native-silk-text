import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedNumber } from 'react-native-silk-text';
import { Card, Label, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

const rnd = (min: number, max: number, dec = 0) => {
  const v = min + Math.random() * (max - min);
  return dec ? Math.round(v * 10 ** dec) / 10 ** dec : Math.round(v);
};

export function StatsScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [seed, setSeed] = useState(0);
  const data = useMemo(
    () => ({
      revenue: rnd(60000, 240000),
      users: rnd(1200, 8800),
      conv: rnd(18, 74, 1),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed]
  );

  return (
    <Screen kicker="Live dashboard" title="Today" accent={colors.green}>
      <Stat label="Revenue" value={data.revenue} prefix="$" separator="," color={colors.green} />
      <Stat label="Active users" value={data.users} separator="," color={colors.accent} />
      <Stat label="Conversion" value={data.conv} suffix="%" decimals={1} color={colors.pink} />

      <Pressable style={styles.refresh} onPress={() => setSeed((s) => s + 1)}>
        <View style={styles.refreshRow}>
          <Ionicons name="refresh" size={16} color={colors.accent} />
          <Text style={styles.refreshText}>Refresh data</Text>
        </View>
      </Pressable>
      <Text style={styles.note}>
        Odometer variant — each digit slides up or down when the value changes.
      </Text>
    </Screen>
  );
}

function Stat({
  label,
  value,
  prefix,
  suffix,
  separator,
  decimals,
  color,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimals?: number;
  color: string;
}) {
  return (
    <Card style={{ marginBottom: spacing(1.5) }}>
      <Label>{label}</Label>
      <View style={{ height: spacing(0.5) }} />
      <AnimatedNumber
        style={{ fontFamily: fonts.mono, fontSize: 44, fontWeight: '800', height: 54, width: '100%', color }}
        value={value}
        variant="odometer"
        from={0}
        prefix={prefix}
        suffix={suffix}
        separator={separator}
        decimals={decimals}
        duration={900}
      />
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    refresh: {
      marginTop: spacing(1),
      backgroundColor: colors.accentSoft,
      borderRadius: radius.pill,
      paddingVertical: spacing(1.75),
      alignItems: 'center',
    },
    refreshRow: { flexDirection: 'row', alignItems: 'center', gap: spacing(1) },
    refreshText: { color: colors.accent, fontSize: 15, fontWeight: '800' },
    note: { color: colors.textFaint, fontSize: 12, marginTop: spacing(2), textAlign: 'center' },
  });
}
