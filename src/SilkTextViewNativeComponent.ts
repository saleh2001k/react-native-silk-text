import { codegenNativeComponent, type CodegenTypes } from 'react-native';
import type { ColorValue, ViewProps } from 'react-native';

/**
 * Flat prop surface consumed by the native Fabric view (SwiftUI on iOS,
 * Jetpack Compose on Android). Codegen has no notion of `style`, so every
 * visual attribute is passed as an individual, primitive prop. The public
 * `<AnimatedText>` component flattens an RN `TextStyle` down to this shape.
 */
export interface NativeProps extends ViewProps {
  /** The text content. Changing it re-triggers the per-letter animation. */
  text?: CodegenTypes.WithDefault<string, ''>;

  // --- Text styling (maps to SwiftUI / Compose text modifiers) ---
  color?: ColorValue;
  fontFamily?: CodegenTypes.WithDefault<string, ''>;
  fontSize?: CodegenTypes.WithDefault<CodegenTypes.Double, 17>;
  /** normal | bold | 100..900 */
  fontWeight?: CodegenTypes.WithDefault<string, 'normal'>;
  /** normal | italic */
  fontStyle?: CodegenTypes.WithDefault<string, 'normal'>;
  /** left | center | right | justify | auto */
  textAlign?: CodegenTypes.WithDefault<string, 'auto'>;
  letterSpacing?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
  /** Absolute line height in points. 0 = automatic. */
  lineHeight?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
  /** 0 = unlimited. */
  numberOfLines?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
  /** Shrink the font (down to minimumFontScale) so the text fits numberOfLines. */
  adjustsFontSizeToFit?: CodegenTypes.WithDefault<boolean, false>;
  /** Smallest scale used by adjustsFontSizeToFit. */
  minimumFontScale?: CodegenTypes.WithDefault<CodegenTypes.Double, 0.5>;
  /** head | middle | tail | clip */
  ellipsizeMode?: CodegenTypes.WithDefault<string, 'tail'>;
  /** none | uppercase | lowercase | capitalize */
  textTransform?: CodegenTypes.WithDefault<string, 'none'>;
  /** auto | ltr | rtl */
  writingDirection?: CodegenTypes.WithDefault<string, 'auto'>;
  allowFontScaling?: CodegenTypes.WithDefault<boolean, true>;

  // --- Animation config ---
  /** Animation effect id. Only 'slide' is implemented today. */
  animationType?: CodegenTypes.WithDefault<string, 'slide'>;
  /** Spring response in milliseconds. */
  animationDuration?: CodegenTypes.WithDefault<CodegenTypes.Double, 500>;
  /** Per-element stagger delay in seconds. */
  animationStagger?: CodegenTypes.WithDefault<CodegenTypes.Double, 0.05>;
  /** letters | words */
  unit?: CodegenTypes.WithDefault<string, 'letters'>;
  /** When false the text snaps without animating. */
  animationEnabled?: CodegenTypes.WithDefault<boolean, true>;

  /** Fired once the staggered animation settles. */
  onAnimationComplete?: CodegenTypes.BubblingEventHandler<
    Readonly<{ text: string }>
  >;
}

export default codegenNativeComponent<NativeProps>('SilkTextView');
