import {
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { NativeProps } from './SilkTextViewNativeComponent';

/**
 * Web / non-native fallback. The native animation lives in SwiftUI / Compose,
 * so on web we simply render the resolved text with the equivalent style. No
 * per-letter animation here — Fabric native components do not run on web.
 */
export function SilkTextView(props: NativeProps) {
  const {
    text,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    textAlign,
    letterSpacing,
    lineHeight,
    textTransform,
    writingDirection,
    numberOfLines,
    allowFontScaling,
    style,
    // animation props are irrelevant on web
    animationType: _animationType,
    animationDuration: _animationDuration,
    animationStagger: _animationStagger,
    unit: _unit,
    animationEnabled: _animationEnabled,
    onAnimationComplete: _onAnimationComplete,
    ...rest
  } = props as NativeProps & { style?: StyleProp<ViewStyle> };

  const textStyle: TextStyle = {
    color: color as TextStyle['color'],
    fontFamily: fontFamily || undefined,
    fontSize: fontSize || undefined,
    fontWeight: (fontWeight as TextStyle['fontWeight']) || undefined,
    fontStyle: (fontStyle as TextStyle['fontStyle']) || undefined,
    textAlign: (textAlign as TextStyle['textAlign']) || undefined,
    letterSpacing: letterSpacing || undefined,
    lineHeight: lineHeight || undefined,
    textTransform: (textTransform as TextStyle['textTransform']) || undefined,
    writingDirection:
      (writingDirection as TextStyle['writingDirection']) || undefined,
  };

  return (
    <Text
      {...(rest as object)}
      style={[style as StyleProp<TextStyle>, textStyle]}
      numberOfLines={numberOfLines || undefined}
      allowFontScaling={allowFontScaling ?? undefined}
    >
      {text}
    </Text>
  );
}
