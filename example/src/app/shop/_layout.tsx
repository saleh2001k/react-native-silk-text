import { Stack, useIsFocused } from 'expo-router';
import { useStackScreenOptions } from '../../components/ThemedStack';

export default function ShopLayout() {
  const isFocused = useIsFocused();
  const screenOptions = useStackScreenOptions();

  if (!isFocused) return null;

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Pricing' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
    </Stack>
  );
}
