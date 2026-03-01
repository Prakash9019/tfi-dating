import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F1ECE6' }}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* The Auth Stack is the initial route because index.tsx is inside it */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* The Main/Verification Stack */}
        <Stack.Screen name="(main)" options={{ headerShown: false }} />
        <Stack.Screen name="(fandom)" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}