import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#F1ECE6' },
      }}
    >
      <Stack.Screen name="verification-start" />
      
      {/* THIS IS IMPORTANT FOR THE SLIDE-UP BEHAVIOR */}
      <Stack.Screen 
        name="verification-guide" 
        options={{ 
          presentation: 'transparentModal', // Makes background see-through
          animation: 'slide_from_bottom', // Slides up from bottom
          gestureEnabled: true, // Allows swipe down to dismiss
          gestureDirection: 'vertical',
        }} 
      />
      
      <Stack.Screen name="camera" />
      <Stack.Screen name="analysis" />
      <Stack.Screen name="error" />
    </Stack>
  );
}