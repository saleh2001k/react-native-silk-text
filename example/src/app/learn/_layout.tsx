import { Stack, useIsFocused } from 'expo-router';
import { useStackScreenOptions } from '../../components/ThemedStack';

export default function LearnLayout() {
  const isFocused = useIsFocused();
  const screenOptions = useStackScreenOptions();

  if (!isFocused) return null;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Get started' }} />
      <Stack.Screen name="quotes" options={{ title: 'Testimonials' }} />
    </Stack>
  );
}
