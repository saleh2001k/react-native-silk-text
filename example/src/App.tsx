import { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type TextStyle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AnimatedText } from 'react-native-silk-text';
import { ShowcaseCard } from './components/ShowcaseCard';
import { fonts, spacing, theme } from './theme';

function useCycle<T>(items: T[]): [T, () => void] {
  const [i, setI] = useState(0);
  const next = useCallback(
    () => setI((v) => (v + 1) % items.length),
    [items.length]
  );
  return [items[i] as T, next];
}

export default function App() {
  const [hero, nextHero] = useCycle(['Silk', 'Smooth', 'Native', 'Fluid']);
  const [serif, nextSerif] = useCycle(['Elegant', 'Serif', 'Classic']);
  const [mono, nextMono] = useCycle(['monospace', 'console', '01010']);
  const [cursive, nextCursive] = useCycle(['Signature', 'Flourish']);
  const [small, nextSmall] = useCycle(['caption text', 'tiny but smooth']);
  const [display, nextDisplay] = useCycle(['BIG', 'BOLD', 'WOW']);
  const [en, nextEn] = useCycle(['Hello World', 'Good Morning']);
  const [ar, nextAr] = useCycle(['مرحبا بالعالم', 'صباح الخير']);
  const [cjk, nextCjk] = useCycle(['你好世界', 'こんにちは']);
  const [emoji, nextEmoji] = useCycle(['🚀✨🎉', '🔥💎🌙']);
  const [left, nextLeft] = useCycle(['left aligned', 'start edge']);
  const [center, nextCenter] = useCycle(['centered', 'middle line']);
  const [right, nextRight] = useCycle(['right aligned', 'end edge']);
  const [colorful, nextColorful] = useCycle(['Gradient vibes', 'Colorful']);
  const [spaced, nextSpaced] = useCycle(['S P A C E D', 'T R A C K']);

  // Layout: wrapping, font-fit, line limits, ellipsize
  const [para, nextPara] = useCycle([
    'This long passage flows across multiple lines and every word eases into place — wrapping is fully native on iOS and Android.',
    'Pour in paragraphs and the layout reflows automatically while each word animates in sequence.',
  ]);
  const [fit, nextFit] = useCycle([
    'Shrinks to fit one single line',
    'adjustsFontSizeToFit keeps this on a single line no matter how long',
  ]);
  const [clamp, nextClamp] = useCycle([
    'Clamped to two lines with a trailing ellipsis when the content runs longer than the space allows on screen.',
    'numberOfLines limits the height and the overflow is truncated cleanly with an ellipsis at the end.',
  ]);
  const [ell, nextEll] = useCycle([
    'One single line that is simply far too long to ever fit so it must be truncated',
    'Ellipsize handles overflow on a single line gracefully and predictably',
  ]);
  const [ellipsize, setEllipsize] = useState<'tail' | 'clip'>('tail');

  // Live animation-config playground
  const [unit, setUnit] = useState<'letters' | 'words'>('letters');
  const [stagger, setStagger] = useState(0.05);
  const [duration, setDuration] = useState(500);
  const [playground, nextPlayground] = useCycle([
    'Tune the motion',
    'Letters or words',
    'Your call Your call Your call Your call Your call Your call Your call Your call Your call Your call Your call',
  ]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>react-native-silk-text</Text>
        <Text style={styles.h1}>AnimatedText</Text>
        <Text style={styles.lede}>
          Fully-native per-letter text animation — SwiftUI on iOS, Jetpack
          Compose on Android. Tap any card to replay.
        </Text>

        <ShowcaseCard
          title="Hero"
          subtitle="Big, springy, staggered"
          hint="duration 600ms · stagger 0.06s"
          onReplay={nextHero}
        >
          <AnimatedText
            style={[styles.text, styles.hero]}
            animation={{ duration: 600, stagger: 0.06 }}
            onAnimationComplete={() => {}}
          >
            {hero}
          </AnimatedText>
        </ShowcaseCard>

        <Text style={styles.section}>Fonts</Text>
        <ShowcaseCard title="Serif" onReplay={nextSerif}>
          <AnimatedText
            style={[styles.text, styles.row, { fontFamily: fonts.serif }]}
          >
            {serif}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Monospace" onReplay={nextMono}>
          <AnimatedText
            style={[styles.text, styles.row, { fontFamily: fonts.mono }]}
          >
            {mono}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Cursive · italic" onReplay={nextCursive}>
          <AnimatedText
            style={[
              styles.text,
              styles.row,
              { fontFamily: fonts.cursive, fontStyle: 'italic' },
            ]}
          >
            {cursive}
          </AnimatedText>
        </ShowcaseCard>

        <Text style={styles.section}>Sizes &amp; weights</Text>
        <ShowcaseCard title="Caption" onReplay={nextSmall}>
          <AnimatedText style={[styles.text, { fontSize: 14, height: 26 }]}>
            {small}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Display · 900" onReplay={nextDisplay}>
          <AnimatedText
            style={[
              styles.text,
              { fontSize: 56, height: 70, fontWeight: '900' },
            ]}
            animation={{ stagger: 0.08 }}
          >
            {display}
          </AnimatedText>
        </ShowcaseCard>

        <Text style={styles.section}>Languages</Text>
        <ShowcaseCard title="English" onReplay={nextEn}>
          <AnimatedText style={[styles.text, styles.row]}>{en}</AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard
          title="Arabic · RTL"
          subtitle="writingDirection: rtl, textAlign: right"
          onReplay={nextAr}
        >
          <AnimatedText
            style={[
              styles.text,
              styles.row,
              { writingDirection: 'rtl', textAlign: 'right' },
            ]}
          >
            {ar}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="CJK" onReplay={nextCjk}>
          <AnimatedText style={[styles.text, styles.row]}>{cjk}</AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Emoji" onReplay={nextEmoji}>
          <AnimatedText
            style={[styles.text, styles.row, { fontSize: 32, height: 44 }]}
          >
            {emoji}
          </AnimatedText>
        </ShowcaseCard>

        <Text style={styles.section}>Alignment</Text>
        <ShowcaseCard title="Left" onReplay={nextLeft}>
          <AnimatedText
            style={[styles.text, styles.row, { textAlign: 'left' }]}
          >
            {left}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Center" onReplay={nextCenter}>
          <AnimatedText
            style={[styles.text, styles.row, { textAlign: 'center' }]}
          >
            {center}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Right" onReplay={nextRight}>
          <AnimatedText
            style={[styles.text, styles.row, { textAlign: 'right' }]}
          >
            {right}
          </AnimatedText>
        </ShowcaseCard>

        <Text style={styles.section}>Flexibility</Text>
        <ShowcaseCard title="Color" onReplay={nextColorful}>
          <AnimatedText
            style={[styles.text, styles.row, { color: theme.pink }]}
          >
            {colorful}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard title="Letter spacing" onReplay={nextSpaced}>
          <AnimatedText
            style={[
              styles.text,
              styles.row,
              { letterSpacing: 4, color: theme.green },
            ]}
          >
            {spaced}
          </AnimatedText>
        </ShowcaseCard>

        <Text style={styles.section}>Layout</Text>
        <ShowcaseCard
          title="Large content"
          subtitle="wraps across multiple lines"
          onReplay={nextPara}
        >
          <AnimatedText
            style={[styles.text, styles.para]}
            animation={{ unit: 'words', stagger: 0.04, duration: 500 }}
          >
            {para}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard
          title="Adjust font to fit"
          subtitle="numberOfLines=1 · shrinks to width"
          onReplay={nextFit}
        >
          <AnimatedText
            style={[styles.text, styles.fitLine]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.4}
          >
            {fit}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard
          title="Number of lines = 2"
          subtitle="clamped + ellipsis"
          onReplay={nextClamp}
        >
          <AnimatedText
            style={[styles.text, styles.twoLine]}
            numberOfLines={2}
            animation={{ unit: 'words', stagger: 0.03 }}
          >
            {clamp}
          </AnimatedText>
        </ShowcaseCard>
        <ShowcaseCard
          title="Ellipsize mode"
          subtitle={`numberOfLines=1 · ${ellipsize}`}
          onReplay={nextEll}
        >
          <AnimatedText
            style={[styles.text, styles.oneLine]}
            numberOfLines={1}
            ellipsizeMode={ellipsize}
            animation={{ unit: 'words' }}
          >
            {ell}
          </AnimatedText>
          <View style={styles.controls}>
            <Toggle
              label={`mode: ${ellipsize}`}
              onPress={() =>
                setEllipsize((m) => (m === 'tail' ? 'clip' : 'tail'))
              }
            />
          </View>
        </ShowcaseCard>

        <Text style={styles.section}>Animation playground</Text>
        <ShowcaseCard
          title="Tune it live"
          subtitle={`unit: ${unit} · stagger: ${stagger}s · duration: ${duration}ms`}
          onReplay={nextPlayground}
        >
          <AnimatedText
            style={[styles.text, styles.row, { color: theme.amber }]}
            animation={{ unit, stagger, duration }}
            adjustsFontSizeToFit
          >
            {playground}
          </AnimatedText>
          <View style={styles.controls}>
            <Toggle
              label={unit === 'letters' ? 'Letters' : 'Words'}
              onPress={() =>
                setUnit((u) => (u === 'letters' ? 'words' : 'letters'))
              }
            />
            <Toggle
              label={`Stagger ${stagger}s`}
              onPress={() =>
                setStagger((s) => (s >= 0.12 ? 0.02 : +(s + 0.03).toFixed(2)))
              }
            />
            <Toggle
              label={`Speed ${duration}ms`}
              onPress={() => setDuration((d) => (d >= 900 ? 300 : d + 200))}
            />
          </View>
        </ShowcaseCard>

        <View style={{ height: spacing(4) }} />
      </ScrollView>
    </View>
  );
}

function Toggle({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.toggle}>
      <Text style={styles.toggleLabel}>{label}</Text>
    </Pressable>
  );
}

const baseText: TextStyle = { color: theme.text, fontFamily: fonts.system };

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  scroll: { padding: spacing(2), paddingTop: spacing(8) },
  kicker: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  h1: { color: theme.text, fontSize: 40, fontWeight: '800', marginTop: 2 },
  lede: {
    color: theme.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginVertical: spacing(1.5),
  },
  section: {
    color: theme.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing(2),
    marginBottom: spacing(1),
  },
  text: { ...baseText, width: '100%' },
  row: { fontSize: 28, height: 40 },
  hero: { fontSize: 48, height: 60, fontWeight: '800' },
  para: { fontSize: 18, height: 130, lineHeight: 26 },
  fitLine: { fontSize: 34, height: 46, fontWeight: '700' },
  twoLine: { fontSize: 18, height: 56, lineHeight: 26 },
  oneLine: { fontSize: 18, height: 30 },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
    marginTop: spacing(1.5),
  },
  toggle: {
    backgroundColor: theme.accentSoft,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.75),
    borderRadius: 999,
  },
  toggleLabel: { color: theme.accent, fontSize: 13, fontWeight: '600' },
});
