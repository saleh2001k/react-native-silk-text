import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { TabList, TabTrigger } from 'expo-router/ui';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../hooks/use-app-theme';
import { spacing } from '../theme';

const TABS = [
  {
    name: 'index',
    href: '/' as const,
    label: 'Brand',
    icon: 'sparkles-outline' as const,
    iconFocused: 'sparkles' as const,
  },
  {
    name: 'feed',
    href: '/feed' as const,
    label: 'Feed',
    icon: 'newspaper-outline' as const,
    iconFocused: 'newspaper' as const,
  },
  {
    name: 'learn',
    href: '/learn' as const,
    label: 'Learn',
    icon: 'book-outline' as const,
    iconFocused: 'book' as const,
  },
  {
    name: 'stats',
    href: '/stats' as const,
    label: 'Stats',
    icon: 'bar-chart-outline' as const,
    iconFocused: 'bar-chart' as const,
  },
  {
    name: 'shop',
    href: '/shop' as const,
    label: 'Shop',
    icon: 'cart-outline' as const,
    iconFocused: 'cart' as const,
  },
];

function isTabActive(pathname: string, href: (typeof TABS)[number]['href']) {
  if (href === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TabBar() {
  const pathname = usePathname();
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.wrap}>
      <TabList style={styles.list}>
        {TABS.map((tab) => {
          const focused = isTabActive(pathname, tab.href);
          return (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <Pressable style={[styles.item, focused && styles.itemFocused]}>
                <Ionicons
                  name={focused ? tab.iconFocused : tab.icon}
                  size={22}
                  color={focused ? colors.accent : colors.textFaint}
                />
                <Text style={[styles.label, focused && styles.labelFocused]}>
                  {tab.label}
                </Text>
              </Pressable>
            </TabTrigger>
          );
        })}
      </TabList>
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>['colors']) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: colors.bg,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.cardBorder,
      paddingBottom: spacing(3),
      paddingTop: spacing(1),
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: spacing(1),
    },
    item: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: spacing(1.25),
      borderRadius: 12,
    },
    itemFocused: {
      backgroundColor: colors.bgElevated,
    },
    label: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textFaint,
    },
    labelFocused: {
      color: colors.accent,
    },
  });
}
