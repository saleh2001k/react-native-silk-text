import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedText } from 'react-native-silk-text';
import { Card, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

const QUOTES = [
  { q: 'It honestly feels like the text is alive.', who: 'Maya', role: 'Product Designer' },
  { q: 'Dropped it in and our onboarding popped.', who: 'Diego', role: 'Mobile Lead' },
  { q: 'Native, smooth, and zero Reanimated setup.', who: 'Aisha', role: 'Engineer' },
];

export function QuoteScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [i, setI] = useState(0);
  const item = QUOTES[i]!;

  return (
    <Screen kicker="Testimonials" title="Loved by builders" accent={colors.violet}>
      <Card glow={colors.violet} style={{ minHeight: 300, paddingVertical: spacing(3) }}>
        <Text style={[styles.mark, { color: colors.violet }]}>"</Text>
        <AnimatedText
          style={styles.quote}
          animation={{ unit: 'words', duration: 600, stagger: 0.06 }}
        >
          {item.q}
        </AnimatedText>

        <View style={styles.author}>
          <View style={[styles.avatar, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.initial, { color: colors.violet }]}>{item.who[0]}</Text>
          </View>
          <View>
            <AnimatedText style={styles.name} animation={{ duration: 500, stagger: 0.04 }}>
              {item.who}
            </AnimatedText>
            <Text style={styles.role}>{item.role}</Text>
          </View>
        </View>
      </Card>

      <Pressable style={styles.next} onPress={() => setI((v) => (v + 1) % QUOTES.length)}>
        <Text style={[styles.nextText, { color: colors.violet }]}>Next testimonial</Text>
      </Pressable>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    mark: { fontFamily: fonts.serif, fontSize: 72, height: 56, fontWeight: '800' },
    quote: {
      fontFamily: fonts.serif,
      color: colors.text,
      fontSize: 30,
      fontStyle: 'italic',
      lineHeight: 40,
      height: 130,
      width: '100%',
    },
    author: { flexDirection: 'row', alignItems: 'center', gap: spacing(1.5), marginTop: spacing(2) },
    avatar: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
    initial: { fontSize: 18, fontWeight: '800' },
    name: { fontFamily: fonts.system, color: colors.text, fontSize: 16, fontWeight: '700', height: 22, width: 160 },
    role: { color: colors.textMuted, fontSize: 13 },
    next: {
      marginTop: spacing(1),
      backgroundColor: colors.accentSoft,
      borderRadius: radius.pill,
      paddingVertical: spacing(1.75),
      alignItems: 'center',
    },
    nextText: { fontSize: 15, fontWeight: '800' },
  });
}
