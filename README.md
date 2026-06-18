# react-native-silk-text

**Silky, fully-native per-letter text animation for React Native.**

`<AnimatedText>` is a drop-in replacement for RN `<Text>` whose glyphs re-animate
every time the text changes. The animation runs **entirely on the native side** —
**SwiftUI** on iOS and **Jetpack Compose** on Android — so there is no Reanimated
dependency and no per-frame work crossing the JS bridge.

> New Architecture (Fabric) only.

---

## Why

Most "animated text" libraries drive transforms from JS (Reanimated) or animate the
whole label at once. `react-native-silk-text` splits the string and animates each
letter on the GPU through the platform's own declarative UI toolkit, with an
index-staggered spring. The "slide" effect is ported from the excellent
[AnimateText](https://github.com/jasudev/AnimateText) SwiftUI library by
[jasudev](https://github.com/jasudev).

## Installation

```sh
npm install react-native-silk-text
# or
yarn add react-native-silk-text
```

Requirements:

- React Native **0.81+** with the **New Architecture enabled** (`newArchEnabled=true`).
- iOS 15+ / Android `minSdk` 24+.
- **Expo:** works via a **development build** (`expo-dev-client` + `expo prebuild`).
  It does **not** run in Expo Go (Fabric native components need a custom dev client).

```sh
npx expo install react-native-silk-text expo-dev-client
npx expo prebuild
npx expo run:ios   # or run:android
```

## Usage

```tsx
import { useState } from 'react';
import { Button, View } from 'react-native';
import { AnimatedText } from 'react-native-silk-text';

export default function Demo() {
  const [text, setText] = useState('Hello');
  return (
    <View>
      <AnimatedText
        style={{ fontSize: 48, fontWeight: '800', color: '#6C8CFF', height: 60 }}
        animation={{ duration: 600, stagger: 0.06 }}
        onAnimationComplete={(t) => console.log('done:', t)}
      >
        {text}
      </AnimatedText>

      <Button title="Change" onPress={() => setText('World')} />
    </View>
  );
}
```

### Arabic / RTL

```tsx
<AnimatedText style={{ fontSize: 28, writingDirection: 'rtl', textAlign: 'right' }}>
  مرحبا بالعالم
</AnimatedText>
```

## API

`AnimatedText` accepts the full `TextProps` surface for familiarity and editor
autocomplete. The visual style (via `style`) plus the props below are forwarded to
the native renderer.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `children` / `text` | `string` | `''` | The text. Changing it replays the animation. |
| `style` | `TextStyle` | — | `color`, `fontFamily`, `fontSize`, `fontWeight`, `fontStyle`, `textAlign`, `letterSpacing`, `lineHeight`, `textTransform`, `writingDirection` are mapped natively. Layout boxes (width/height/margin) stay on the host view. |
| `numberOfLines` | `number` | `0` | `0` = unlimited. |
| `allowFontScaling` | `boolean` | `true` | |
| `animation.type` | `'slide'` | `'slide'` | Effect id (more planned). |
| `animation.duration` | `number` (ms) | `500` | Spring response. |
| `animation.stagger` | `number` (s) | `0.05` | Per-element delay. |
| `animation.unit` | `'letters' \| 'words'` | `'letters'` | Split granularity. |
| `animation.enabled` | `boolean` | `true` | `false` snaps without animating. |
| `onAnimationComplete` | `(text: string) => void` | — | Fires when the stagger settles. |

### Not supported

Because the renderer is a single native declarative text view, these RN `<Text>`
features are intentionally **not** supported: nested `<Text>` children, `selectable`,
and per-span `onPress`. Pass a plain string.

### Custom fonts

Register the font with the platform (e.g. `expo-font` / `Fonts` build phase / Android
`assets/fonts`) and pass its family name via `style.fontFamily`. The example app
demonstrates the bundled-OS families (`Georgia`, `Menlo`, `serif`, `monospace`, …).

## Example app

```sh
yarn                  # install workspace deps
yarn example ios      # expo run:ios  (prebuilds + builds a dev client)
yarn example android  # expo run:android
```

The Expo (SDK 56) showcase covers fonts, sizes/weights, languages (English, Arabic
RTL, CJK, emoji), alignments, color/letter-spacing, and a live animation-config
playground.

## How it works

```
JS  <AnimatedText> ──flatten style──▶ <SilkTextView/> (Fabric, flat props)
                                            │ updateProps
        iOS  ──▶ SwiftUI: split text → HStack of Text, per-letter
                  opacity = value, x = width·(1−value), staggered spring
        Android ▶ Compose: split text → Row of Text, graphicsLayer
                  alpha = value, translationX = width·(1−value), staggered spring
```

`value` animates `0 → 1` on every text change; the slide effect mirrors
`ATSlideEffect` from AnimateText.

## Credits

- Slide effect & engine design ported from [AnimateText](https://github.com/jasudev/AnimateText) by jasudev (MIT).
- Built with [create-react-native-library](https://github.com/callstack/react-native-builder-bob).

## License

MIT © Saleh Ayman
