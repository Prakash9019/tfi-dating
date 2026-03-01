import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { COLORS } from '../../constants/theme';

export default function AnalysisScreen() {
  useEffect(() => {
    // Simulate processing delay
    const timer = setTimeout(() => {
      router.push('/error');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6' }} // Simulated selfie
        style={StyleSheet.absoluteFill}
      />
      <BlurView intensity={20} style={styles.overlay}>
        <ActivityIndicator size="large" color="#FFF" style={{ marginBottom: 20 }} />
        <Text style={styles.text}>Analysing...</Text>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(241, 236, 230, 0.6)' },
  text: { fontSize: 18, fontWeight: '700', color: '#000' }
});