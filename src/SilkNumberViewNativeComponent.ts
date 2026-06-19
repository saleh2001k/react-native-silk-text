import { codegenNativeComponent, type CodegenTypes } from 'react-native';
import type { ColorValue, ViewProps } from 'react-native';

/**
 * Flat prop surface for the native animated counter (SwiftUI `numericText` /
 * count-up roll on iOS, animated value on Jetpack Compose). The public
 * `<AnimatedNumber>` component flattens an RN `TextStyle` down to this shape.
 */
export interface NativeProps extends ViewProps {
  /** Target value to count to. */
  value: CodegenTypes.Double;
  /** Starting value for the first run. */
  from?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
  /** Roll duration in milliseconds. */
  duration?: CodegenTypes.WithDefault<CodegenTypes.Double, 2000>;
  /** Delay before the roll starts, in milliseconds. */
  delay?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
  /** Fraction digits to display. */
  decimals?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  /** Thousands grouping separator (empty = none). */
  separator?: CodegenTypes.WithDefault<string, ''>;
  prefix?: CodegenTypes.WithDefault<string, ''>;
  suffix?: CodegenTypes.WithDefault<string, ''>;
  /** Animate on first mount (from -> value). */
  animateOnMount?: CodegenTypes.WithDefault<boolean, true>;
  /** 'roll' = count-up interpolation, 'odometer' = per-digit slide. */
  variant?: CodegenTypes.WithDefault<string, 'roll'>;

  // --- Styling ---
  color?: ColorValue;
  fontFamily?: CodegenTypes.WithDefault<string, ''>;
  fontSize?: CodegenTypes.WithDefault<CodegenTypes.Double, 34>;
  fontWeight?: CodegenTypes.WithDefault<string, 'bold'>;
  fontStyle?: CodegenTypes.WithDefault<string, 'normal'>;
  letterSpacing?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
  textAlign?: CodegenTypes.WithDefault<string, 'auto'>;

  /** Fires when the counter reaches `value`. */
  onCounterEnd?: CodegenTypes.BubblingEventHandler<
    Readonly<{ value: CodegenTypes.Double }>
  >;
}

export default codegenNativeComponent<NativeProps>('SilkNumberView');
