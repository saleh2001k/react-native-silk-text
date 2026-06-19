import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedText } from 'react-native-silk-text';
import { Card, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

const NEWS = [
  { tag: 'Markets', text: 'Tech stocks rally as AI demand surges worldwide' },
  { tag: 'Sports', text: 'Underdogs clinch the title in dramatic overtime' },
  { tag: 'Science', text: 'New telescope captures a newborn galaxy forming' },
  { tag: 'Culture', text: 'A quiet indie film becomes a global sensation' },
];

export function HeadlinesScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % NEWS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const item = NEWS[i]!;

  return (
    <Screen kicker="Live feed" title="Today's brief" accent={colors.pink}>
      <Card glow={colors.pink} style={{ minHeight: 280 }}>
        <View style={styles.meta}>
          <View style={[styles.tag, { backgroundColor: colors.accentSoft }]}>
            <Text style={[styles.tagText, { color: colors.pink }]}>
              {item.tag}
            </Text>
          </View>
          <View style={styles.live}>
            <View style={[styles.dot, { backgroundColor: colors.pink }]} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <AnimatedText
          style={styles.headline}
          animation={{ unit: 'words', duration: 550, stagger: 0.05 }}
        >
          {item.text}
        </AnimatedText>
      </Card>

      <Text style={styles.note}>
        Headlines flip in word-by-word, wrapping natively across lines.
      </Text>
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing(2),
    },
    tag: {
      borderRadius: radius.pill,
      paddingHorizontal: spacing(1.5),
      paddingVertical: spacing(0.75),
    },
    tagText: { fontSize: 12, fontWeight: '800' },
    live: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    liveText: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1,
    },
    headline: {
      fontFamily: fonts.system,
      color: colors.text,
      fontSize: 32,
      fontWeight: '800',
      lineHeight: 40,
      height: 170,
      width: '100%',
    },
    note: {
      color: colors.textFaint,
      fontSize: 12,
      marginTop: spacing(2),
      textAlign: 'center',
    },
  });
}
