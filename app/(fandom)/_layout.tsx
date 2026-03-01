import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function FandomLayout() {
  return (
    // GestureHandlerRootView is REQUIRED for the Drag and Drop list to work
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F1ECE6' } }}>
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="bias" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="top-movies" options={{ animation: 'slide_from_right' }} />
<Stack.Screen name="whats-on-mind" options={{ animation: 'slide_from_right' }} />

<Stack.Screen 
  name="write-slogan" 
  options={{ 
    presentation: 'transparentModal', 
    animation: 'slide_from_bottom',
    headerShown: false 
  }} 
/>
<Stack.Screen name="moods" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}