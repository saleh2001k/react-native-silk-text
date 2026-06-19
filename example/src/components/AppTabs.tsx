import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme } from '../hooks/use-app-theme';

export function AppTabs() {
  const { colors, isDark } = useAppTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NativeTabs
        tintColor={colors.accent}
        disableTransparentOnScrollEdge
        labelStyle={{ color: colors.textFaint }}
      >
        <NativeTabs.Trigger name="index" contentStyle={{ backgroundColor: colors.bg }}>
          <NativeTabs.Trigger.Label>Brand</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'sparkles', selected: 'sparkles' }}
            md={{ default: 'auto_awesome', selected: 'auto_awesome' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="feed" contentStyle={{ backgroundColor: colors.bg }}>
          <NativeTabs.Trigger.Label>Feed</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'newspaper', selected: 'newspaper.fill' }}
            md={{ default: 'article', selected: 'article' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="learn" contentStyle={{ backgroundColor: colors.bg }}>
          <NativeTabs.Trigger.Label>Learn</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'book', selected: 'book.fill' }}
            md={{ default: 'menu_book', selected: 'menu_book' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="stats" contentStyle={{ backgroundColor: colors.bg }}>
          <NativeTabs.Trigger.Label>Stats</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }}
            md={{ default: 'bar_chart', selected: 'bar_chart' }}
          />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="shop" contentStyle={{ backgroundColor: colors.bg }}>
          <NativeTabs.Trigger.Label>Shop</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            sf={{ default: 'cart', selected: 'cart.fill' }}
            md={{ default: 'shopping_cart', selected: 'shopping_cart' }}
          />
        </NativeTabs.Trigger>
      </NativeTabs>
    </ThemeProvider>
  );
}
