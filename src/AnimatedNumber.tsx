import { useCallback } from 'react';
import { StyleSheet, type TextStyle } from 'react-native';
import { SilkNumberView } from './SilkNumberView';
import type { AnimatedNumberProps } from './types';

function weightToString(w: TextStyle['fontWeight']): string | undefined {
  return w == null ? undefined : String(w);
}

export function AnimatedNumber(props: AnimatedNumberProps) {
  const {
    value,
    from,
    duration,
    delay,
    decimals,
    separator,
    prefix,
    suffix,
    animateOnMount,
    variant,
    style,
    onCounterEnd,
    ...rest
  } = props;

  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;

  const handleEnd = useCallback(
    (e: { nativeEvent: { value: number } }) => {
      onCounterEnd?.(e.nativeEvent.value);
    },
    [onCounterEnd]
  );

  return (
    <SilkNumberView
      {...rest}
      style={style}
      value={value}
      from={from ?? 0}
      duration={duration ?? 2000}
      delay={delay ?? 0}
      decimals={decimals ?? 0}
      separator={separator ?? ''}
      prefix={prefix ?? ''}
      suffix={suffix ?? ''}
      animateOnMount={animateOnMount ?? true}
      variant={variant ?? 'roll'}
      color={flat.color}
      fontFamily={flat.fontFamily ?? ''}
      fontSize={flat.fontSize ?? 34}
      fontWeight={weightToString(flat.fontWeight) ?? 'bold'}
      fontStyle={flat.fontStyle ?? 'normal'}
      letterSpacing={flat.letterSpacing ?? 0}
      textAlign={flat.textAlign ?? 'auto'}
      onCounterEnd={handleEnd}
    />
  );
}
