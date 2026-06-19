import { useIsFocused } from 'expo-router';
import type { ComponentType } from 'react';

/**
 * Wraps a top-level tab screen so it fully unmounts when its tab is inactive.
 * Native tabs render all routes eagerly; this defers mounting until first focus
 * and tears down on blur.
 */
export function lazyTabScreen<P extends object>(Screen: ComponentType<P>) {
  function LazyTabRoute(props: P) {
    const isFocused = useIsFocused();
    if (!isFocused) return null;
    return <Screen {...props} />;
  }

  LazyTabRoute.displayName = `LazyTab(${Screen.displayName ?? Screen.name ?? 'Screen'})`;
  return LazyTabRoute;
}
