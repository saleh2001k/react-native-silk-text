import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Tabs, TabSlot } from 'expo-router/ui';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBar } from '../components/TabBar';
import { useAppTheme } from '../hooks/use-app-theme';

export default function WebLayout() {
  const { colors, isDark } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Tabs style={styles.root}>
        <View style={styles.body}>
          <TabSlot />
        </View>
        <TabBar />
      </Tabs>
    </ThemeProvider>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>['colors']) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.bg },
    body: { flex: 1 },
  });
}
