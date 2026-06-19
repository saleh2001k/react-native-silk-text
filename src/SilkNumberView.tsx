import {
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import type { NativeProps } from './SilkNumberViewNativeComponent';

/**
 * Web / non-native fallback. Renders the formatted target value without the
 * native roll animation (Fabric components do not run on web).
 */
export function SilkNumberView(props: NativeProps) {
  const {
    value,
    decimals,
    separator,
    prefix,
    suffix,
    color,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    letterSpacing,
    textAlign,
    style,
    ...rest
  } = props as NativeProps & { style?: StyleProp<ViewStyle> };

  const formatted = new Intl.NumberFormat('en-US', {
    useGrouping: !!separator,
    minimumFractionDigits: decimals ?? 0,
    maximumFractionDigits: decimals ?? 0,
  })
    .format(value ?? 0)
    .replace(/,/g, separator || ',');

  const textStyle: TextStyle = {
    color: color as TextStyle['color'],
    fontFamily: fontFamily || undefined,
    fontSize: fontSize || undefined,
    fontWeight: (fontWeight as TextStyle['fontWeight']) || undefined,
    fontStyle: (fontStyle as TextStyle['fontStyle']) || undefined,
    letterSpacing: letterSpacing || undefined,
    textAlign: (textAlign as TextStyle['textAlign']) || undefined,
  };

  return (
    <Text {...(rest as object)} style={[style as StyleProp<TextStyle>, textStyle]}>
      {`${prefix ?? ''}${formatted}${suffix ?? ''}`}
    </Text>
  );
}
