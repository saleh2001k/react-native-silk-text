import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedText } from 'react-native-silk-text';
import { Card, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

const STEPS = [
  { title: 'Install', body: 'Add the package and turn on the New Architecture.' },
  { title: 'Wrap your text', body: 'Swap Text for AnimatedText and keep every prop.' },
  { title: 'Add counters', body: 'Roll or odometer numbers, formatted out of the box.' },
  { title: 'Ship it', body: 'Native motion on iOS and Android. No Reanimated.' },
];

export function StepsScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [i, setI] = useState(0);
  const step = STEPS[i]!;
  const last = i === STEPS.length - 1;

  return (
    <Screen kicker={`Step ${i + 1} of ${STEPS.length}`} title="Get started" accent={colors.green}>
      <View style={styles.dots}>
        {STEPS.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              {
                backgroundColor: idx <= i ? colors.green : colors.cardBorder,
                width: idx === i ? 26 : 8,
              },
            ]}
          />
        ))}
      </View>

      <Card glow={colors.green} style={{ minHeight: 220, paddingVertical: spacing(3) }}>
        <Text style={[styles.num, { color: colors.green }]}>{`0${i + 1}`}</Text>
        <AnimatedText style={styles.title} animation={{ duration: 550, stagger: 0.05 }}>
          {step.title}
        </AnimatedText>
        <AnimatedText
          style={styles.body}
          animation={{ unit: 'words', duration: 550, stagger: 0.04 }}
        >
          {step.body}
        </AnimatedText>
      </Card>

      <View style={styles.actions}>
        <Pressable
          style={[styles.ghost, i === 0 && { opacity: 0.35 }]}
          onPress={() => setI((v) => Math.max(0, v - 1))}
        >
          <Text style={styles.ghostText}>Back</Text>
        </Pressable>
        <Pressable
          style={[styles.primary, { backgroundColor: colors.green }]}
          onPress={() => setI((v) => (last ? 0 : v + 1))}
        >
          <Text style={[styles.primaryText, { color: colors.onAccent }]}>
            {last ? 'Restart' : 'Next'}
          </Text>
        </Pressable>
      </View>

      <Link href="/learn/quotes" asChild>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>View testimonials</Text>
        </Pressable>
      </Link>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    dots: { flexDirection: 'row', gap: 6, marginBottom: spacing(2.5) },
    dot: { height: 8, borderRadius: 4 },
    num: { fontFamily: fonts.mono, fontSize: 16, fontWeight: '800', marginBottom: spacing(1) },
    title: { fontFamily: fonts.system, color: colors.text, fontSize: 34, fontWeight: '800', height: 44, width: '100%' },
    body: { fontFamily: fonts.system, color: colors.textMuted, fontSize: 17, lineHeight: 24, height: 60, width: '100%', marginTop: spacing(1) },
    actions: { flexDirection: 'row', gap: spacing(1.5), marginTop: spacing(2) },
    ghost: {
      flex: 1,
      borderRadius: radius.pill,
      paddingVertical: spacing(2),
      alignItems: 'center',
      backgroundColor: colors.bgElevated,
    },
    ghostText: { color: colors.textMuted, fontSize: 16, fontWeight: '700' },
    primary: {
      flex: 2,
      borderRadius: radius.pill,
      paddingVertical: spacing(2),
      alignItems: 'center',
    },
    primaryText: { fontSize: 16, fontWeight: '800' },
    link: {
      marginTop: spacing(1.5),
      backgroundColor: colors.accentSoft,
      borderRadius: radius.pill,
      paddingVertical: spacing(1.75),
      alignItems: 'center',
    },
    linkText: { color: colors.green, fontSize: 15, fontWeight: '800' },
  });
}
