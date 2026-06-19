import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedText } from 'react-native-silk-text';
import { Card, Label, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

const VERBS = ['move.', 'breathe.', 'delight.', 'convert.'];

export function BrandScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % VERBS.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <Screen
      kicker="react-native-silk-text"
      title="Interfaces that…"
      accent={colors.violet}
    >
      <Card glow={colors.violet} style={{ paddingVertical: spacing(3.5) }}>
        <Label>Headline</Label>
        <View style={{ height: spacing(1) }} />
        <AnimatedText
          style={styles.brand}
          animation={{ duration: 650, stagger: 0.05 }}
        >
          Silk
        </AnimatedText>
        <AnimatedText
          style={[styles.verb, { color: colors.violet }]}
          animation={{ duration: 650, stagger: 0.06 }}
        >
          {VERBS[i]}
        </AnimatedText>
        <Text style={styles.sub}>
          Fully-native per-letter motion — SwiftUI &amp; Jetpack Compose. No
          Reanimated, no bridge traffic.
        </Text>
      </Card>

      <View style={styles.features}>
        <Feature
          icon="flash"
          title="60fps native"
          body="Animations run on the platform's own UI toolkit."
          colors={colors}
        />
        <Feature
          icon="swap-horizontal"
          title="Drop-in Text"
          body="Wraps RN <Text> props: fonts, RTL, wrapping, ellipsis."
          colors={colors}
        />
        <Feature
          icon="calculator"
          title="Counters"
          body="Roll & odometer number animations, formatted."
          colors={colors}
        />
      </View>

      <Pressable style={[styles.cta, { backgroundColor: colors.violet }]}>
        <Text style={[styles.ctaText, { color: colors.onAccent }]}>
          Get started
        </Text>
      </Pressable>
    </Screen>
  );
}

function Feature({
  icon,
  title,
  body,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  colors: ThemeColors;
}) {
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Card style={{ flex: 1, marginBottom: 0, padding: spacing(2) }}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.accent}
        style={styles.featIcon}
      />
      <Text style={styles.featTitle}>{title}</Text>
      <Text style={styles.featBody}>{body}</Text>
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    brand: {
      fontFamily: fonts.system,
      color: colors.text,
      fontSize: 64,
      fontWeight: '800',
      height: 76,
      width: '100%',
    },
    verb: {
      fontFamily: fonts.system,
      fontSize: 44,
      fontWeight: '800',
      height: 54,
      width: '100%',
    },
    sub: {
      color: colors.textMuted,
      fontSize: 15,
      lineHeight: 22,
      marginTop: spacing(2),
    },
    features: {
      flexDirection: 'row',
      gap: spacing(1.5),
      marginBottom: spacing(2),
    },
    featIcon: { marginBottom: spacing(1) },
    featTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
    featBody: {
      color: colors.textFaint,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 4,
    },
    cta: {
      borderRadius: radius.pill,
      paddingVertical: spacing(2),
      alignItems: 'center',
    },
    ctaText: { fontSize: 16, fontWeight: '800' },
  });
}
