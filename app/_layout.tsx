import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="details" options={{ 
          presentation: 'modal',
          headerShown: true,
          headerStyle: { backgroundColor: '#1c1c1c' },
          headerTintColor: '#fff',
       }} />
    </Stack>
  );
}