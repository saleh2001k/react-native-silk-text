import { useCallback } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';
import { SilkTextView } from './SilkTextView';
import type { AnimatedTextProps } from './types';

/**
 * Pull the text-layout boxes (width/height/margin/padding/etc.) out of a
 * flattened style so they stay on the native host view, while the glyph-level
 * style (font, color, alignment…) is forwarded as discrete native props.
 */
function resolveText(props: AnimatedTextProps): string {
  if (typeof props.text === 'string') return props.text;
  if (props.children == null) return '';
  return String(props.children);
}

function weightToString(w: TextStyle['fontWeight']): string | undefined {
  if (w == null) return undefined;
  return String(w);
}

export function AnimatedText(props: AnimatedTextProps) {
  const {
    text: _text,
    children: _children,
    style,
    animation,
    onAnimationComplete,
    numberOfLines,
    allowFontScaling,
    adjustsFontSizeToFit,
    minimumFontScale,
    ellipsizeMode,
    ...rest
  } = props;

  const text = resolveText(props);
  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;

  const handleComplete = useCallback(
    (e: { nativeEvent: { text: string } }) => {
      onAnimationComplete?.(e.nativeEvent.text);
    },
    [onAnimationComplete]
  );

  return (
    <SilkTextView
      {...rest}
      style={style}
      text={text}
      color={flat.color}
      fontFamily={flat.fontFamily ?? ''}
      fontSize={flat.fontSize ?? 17}
      fontWeight={weightToString(flat.fontWeight) ?? 'normal'}
      fontStyle={flat.fontStyle ?? 'normal'}
      textAlign={flat.textAlign ?? 'auto'}
      letterSpacing={flat.letterSpacing ?? 0}
      lineHeight={flat.lineHeight ?? 0}
      textTransform={flat.textTransform ?? 'none'}
      writingDirection={flat.writingDirection ?? 'auto'}
      numberOfLines={numberOfLines ?? 0}
      allowFontScaling={allowFontScaling ?? true}
      adjustsFontSizeToFit={adjustsFontSizeToFit ?? false}
      minimumFontScale={minimumFontScale ?? 0.5}
      ellipsizeMode={ellipsizeMode ?? 'tail'}
      animationType={animation?.type ?? 'slide'}
      animationDuration={animation?.duration ?? 500}
      animationStagger={animation?.stagger ?? 0.05}
      unit={animation?.unit ?? 'letters'}
      animationEnabled={animation?.enabled ?? true}
      onAnimationComplete={handleComplete}
    />
  );
}
