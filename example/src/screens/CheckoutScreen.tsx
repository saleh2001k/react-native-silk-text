import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedNumber } from 'react-native-silk-text';
import { Card, Label, Row, Screen } from '../components/ui';
import { useAppTheme } from '../hooks/use-app-theme';
import { fonts, radius, spacing, type ThemeColors } from '../theme';

type Item = { id: string; name: string; price: number; qty: number };

const INITIAL: Item[] = [
  { id: 'a', name: 'Silk License — Pro', price: 49, qty: 1 },
  { id: 'b', name: 'Icon pack', price: 12, qty: 2 },
  { id: 'c', name: 'Sound kit', price: 8, qty: 1 },
];

const SHIPPING = 4.99;

export function CheckoutScreen() {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [items, setItems] = useState(INITIAL);

  const setQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it
      )
    );

  const count = items.reduce((s, it) => s + it.qty, 0);
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const total = subtotal > 0 ? subtotal + SHIPPING : 0;

  return (
    <Screen kicker="Checkout" title="Your bag" accent={colors.pink}>
      <Card style={{ marginBottom: spacing(1.5) }}>
        {items.map((it, idx) => (
          <Row
            key={it.id}
            style={[
              styles.item,
              idx < items.length - 1 ? styles.itemBorder : null,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{it.name}</Text>
              <Text style={styles.itemPrice}>${it.price.toFixed(2)}</Text>
            </View>
            <Row style={{ gap: spacing(1.5) }}>
              <Stepper
                label="-"
                onPress={() => setQty(it.id, -1)}
                colors={colors}
              />
              <Text style={styles.qty}>{it.qty}</Text>
              <Stepper
                label="+"
                onPress={() => setQty(it.id, 1)}
                colors={colors}
              />
            </Row>
          </Row>
        ))}
      </Card>

      <Card glow={colors.pink}>
        <Row
          style={{ justifyContent: 'space-between', marginBottom: spacing(1) }}
        >
          <Label>Items</Label>
          <AnimatedNumber
            style={styles.small}
            value={count}
            variant="odometer"
            duration={500}
          />
        </Row>
        <Row
          style={{ justifyContent: 'space-between', marginBottom: spacing(1) }}
        >
          <Text style={styles.muted}>Subtotal</Text>
          <AnimatedNumber
            style={styles.small}
            value={subtotal}
            prefix="$"
            decimals={2}
            separator=","
            duration={600}
          />
        </Row>
        <Row
          style={{
            justifyContent: 'space-between',
            marginBottom: spacing(1.5),
          }}
        >
          <Text style={styles.muted}>Shipping</Text>
          <Text style={styles.small}>
            ${subtotal > 0 ? SHIPPING.toFixed(2) : '0.00'}
          </Text>
        </Row>
        <View style={styles.divider} />
        <Row
          style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}
        >
          <Text style={styles.totalLabel}>Total</Text>
          <AnimatedNumber
            style={[styles.small, styles.total, { color: colors.pink }]}
            value={total}
            prefix="$"
            decimals={2}
            separator=","
            duration={900}
          />
        </Row>
      </Card>

      <Pressable
        style={[
          styles.cta,
          { backgroundColor: colors.pink },
          count === 0 && { opacity: 0.4 },
        ]}
      >
        <Text style={[styles.ctaText, { color: colors.onAccent }]}>
          Place order
        </Text>
      </Pressable>
    </Screen>
  );
}

function Stepper({
  label,
  onPress,
  colors,
}: {
  label: string;
  onPress: () => void;
  colors: ThemeColors;
}) {
  return (
    <Pressable
      style={[stepperStyles.btn, { backgroundColor: colors.accentSoft }]}
      onPress={onPress}
    >
      <Text style={[stepperStyles.text, { color: colors.accent }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const stepperStyles = StyleSheet.create({
  btn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontSize: 18, fontWeight: '800' },
});

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    item: { paddingVertical: spacing(1.5) },
    itemBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.cardBorder,
    },
    itemName: { color: colors.text, fontSize: 15, fontWeight: '600' },
    itemPrice: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
    qty: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
      minWidth: 20,
      textAlign: 'center',
    },
    muted: { color: colors.textMuted, fontSize: 15 },
    small: {
      fontFamily: fonts.mono,
      color: colors.text,
      fontSize: 16,
      fontWeight: '700',
      height: 22,
      width: 120,
      textAlign: 'right',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.cardBorder,
      marginBottom: spacing(1.5),
    },
    totalLabel: { color: colors.text, fontSize: 16, fontWeight: '800' },
    total: { fontSize: 36, height: 44, width: 160 },
    cta: {
      marginTop: spacing(2),
      borderRadius: radius.pill,
      paddingVertical: spacing(2),
      alignItems: 'center',
    },
    ctaText: { fontSize: 16, fontWeight: '800' },
  });
}
