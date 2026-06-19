import type { StyleProp, TextProps, TextStyle, ViewProps } from 'react-native';

/** Animation effects ported from the AnimateText SwiftUI library. */
export type SilkAnimationType = 'slide';

/** How the text is split before animating. */
export type SilkUnit = 'letters' | 'words';

export interface SilkAnimationConfig {
  /** Effect id. Only `'slide'` ships today; the type is open for growth. */
  type?: SilkAnimationType;
  /** Spring response in milliseconds. Larger = slower, looser. Default 500. */
  duration?: number;
  /** Per-element stagger delay in seconds. Default 0.05. */
  stagger?: number;
  /** Split by `'letters'` (default) or `'words'`. */
  unit?: SilkUnit;
  /** Disable to make the text snap into place without animating. */
  enabled?: boolean;
}

/**
 * `AnimatedText` is a drop-in replacement for RN `<Text>`. It accepts the full
 * `TextProps` surface for editor autocomplete and API familiarity. Visual style
 * (via `style`) and the props below are forwarded to a fully-native renderer
 * (SwiftUI / Jetpack Compose) that re-animates every glyph whenever the text
 * changes.
 *
 * Not supported by the native renderer (a single declarative text view):
 * nested `<Text>` children, `selectable`, and per-span `onPress`. Pass a plain
 * string as the child.
 */
export interface AnimatedTextProps extends Omit<TextProps, 'children'> {
  /** The text to render. Strings only — nested <Text> is not supported. */
  children?: string | number;
  /** Alternative to `children`. */
  text?: string;
  /** Per-letter animation configuration. */
  animation?: SilkAnimationConfig;
  /** Fired once the staggered animation settles. */
  onAnimationComplete?: (text: string) => void;
}

/**
 * `AnimatedNumber` is a native animated counter. The displayed value rolls from
 * `from` to `value` over `duration`, formatted with optional grouping and
 * fixed decimals. On iOS 17+ the digit transitions use `numericText()`.
 */
export interface AnimatedNumberProps extends Omit<ViewProps, 'children'> {
  /** Target value to count to. Changing it re-rolls from the current value. */
  value: number;
  /** Starting value for the first run. Default 0. */
  from?: number;
  /** Roll duration in milliseconds. Default 2000. */
  duration?: number;
  /** Delay before the roll starts, in milliseconds. Default 0. */
  delay?: number;
  /** Fraction digits to display. Default 0. */
  decimals?: number;
  /** Thousands grouping separator, e.g. `','`. Empty = none. */
  separator?: string;
  /** Text rendered before the number. */
  prefix?: string;
  /** Text rendered after the number. */
  suffix?: string;
  /** Animate on first mount (from -> value). Default true. */
  animateOnMount?: boolean;
  /** `'roll'` counts up smoothly; `'odometer'` slides each digit up/down on change. */
  variant?: 'roll' | 'odometer';
  /** Visual style (color, fontFamily, fontSize, fontWeight, fontStyle, …). */
  style?: StyleProp<TextStyle>;
  /** Fires when the counter reaches `value`. */
  onCounterEnd?: (value: number) => void;
}
