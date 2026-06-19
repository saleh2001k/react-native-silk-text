import { Tabs, TabSlot } from 'expo-router/ui';
import { View } from 'react-native';
import { TabBar } from '../src/components/TabBar';
import { theme } from '../src/theme';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Tabs>
        <TabSlot />
        <TabBar />
      </Tabs>
    </View>
  );
}
