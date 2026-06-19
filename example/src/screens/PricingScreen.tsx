import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedNumber, AnimatedText } from 'react-native-silk-text';
import { Card, Label, Pill, Row, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

const FEATURES = [
  'Unlimited projects',
  'Native animations',
  'Priority support',
  'Team seats',
];

export function PricingScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [yearly, setYearly] = useState(false);
  const price = yearly ? 290 : 29;

  return (
    <Screen kicker="Pricing" title="Simple, fair" accent={colors.amber}>
      <Row style={{ gap: spacing(1), marginBottom: spacing(2.5) }}>
        <Pill
          label="Monthly"
          active={!yearly}
          onPress={() => setYearly(false)}
          accent={colors.amber}
        />
        <Pill
          label="Yearly"
          active={yearly}
          onPress={() => setYearly(true)}
          accent={colors.amber}
        />
        {yearly ? (
          <View style={styles.save}>
            <Text style={[styles.saveText, { color: colors.amber }]}>
              Save 17%
            </Text>
          </View>
        ) : null}
      </Row>

      <Card glow={colors.amber} style={{ paddingVertical: spacing(3) }}>
        <Label>Plan</Label>
        <AnimatedText
          style={styles.plan}
          animation={{ duration: 600, stagger: 0.05 }}
        >
          Pro
        </AnimatedText>

        <Row style={{ alignItems: 'flex-end', marginTop: spacing(1) }}>
          <Text style={styles.currency}>$</Text>
          <AnimatedNumber
            style={styles.price}
            value={price}
            variant="odometer"
            duration={700}
          />
          <Text style={styles.per}>/{yearly ? 'yr' : 'mo'}</Text>
        </Row>

        <View style={{ height: spacing(2) }} />
        {FEATURES.map((f) => (
          <Row key={f} style={{ marginBottom: spacing(1) }}>
            <Ionicons
              name="checkmark"
              size={15}
              color={colors.amber}
              style={styles.check}
            />
            <Text style={styles.feature}>{f}</Text>
          </Row>
        ))}

        <Link href="/shop/checkout" asChild>
          <Pressable style={styles.cta}>
            <Text style={styles.ctaText}>Start free trial</Text>
          </Pressable>
        </Link>
      </Card>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    plan: {
      fontFamily: fonts.system,
      color: colors.text,
      fontSize: 40,
      fontWeight: '800',
      height: 50,
      width: '100%',
    },
    currency: {
      color: colors.text,
      fontSize: 30,
      fontWeight: '800',
      marginBottom: 8,
      marginRight: 2,
    },
    price: {
      fontFamily: fonts.mono,
      color: colors.text,
      fontSize: 64,
      fontWeight: '800',
      height: 70,
      width: 160,
    },
    per: {
      color: colors.textMuted,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 12,
      marginLeft: 4,
    },
    check: { width: 22 },
    feature: { color: colors.text, fontSize: 15 },
    save: {
      backgroundColor: colors.accentSoft,
      borderRadius: radius.pill,
      paddingHorizontal: spacing(1.5),
      paddingVertical: spacing(0.75),
    },
    saveText: { fontSize: 12, fontWeight: '800' },
    cta: {
      marginTop: spacing(2.5),
      backgroundColor: colors.amber,
      borderRadius: radius.pill,
      paddingVertical: spacing(2),
      alignItems: 'center',
    },
    ctaText: { color: colors.onAccent, fontSize: 16, fontWeight: '800' },
  });
}
