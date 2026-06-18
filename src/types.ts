import type { TextProps } from 'react-native';

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
