import { Stack } from 'expo-router';
import { useStackScreenOptions } from '../../components/ThemedStack';

export default function ShopLayout() {
  const screenOptions = useStackScreenOptions();

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: 'Pricing' }} />
      <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
    </Stack>
  );
}
