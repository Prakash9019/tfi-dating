import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      // Forces the stack to start at the login screen instead of index
      initialRouteName="login" 
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', 
        contentStyle: { backgroundColor: '#F1ECE6' },
      }}
    >
      {/* Authentication Screens */}
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      
      {/* Onboarding & Verification Flow */}
      <Stack.Screen name="index" /> {/* The "Introduce Yourself" screen */}
      <Stack.Screen name="username" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="photos" />
    </Stack>
  );
}