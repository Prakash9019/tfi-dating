import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MotiView } from 'moti';

export default function FandomSplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(fandom)/bias');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background abstract shapes (Simulated) */}
      <View style={[styles.shape, styles.shapeTop]} />
      <View style={[styles.shape, styles.shapeBottom]} />
      <View style={[styles.shape, styles.shapeRight]} />

      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <Text style={styles.title}>Fandom</Text>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  title: { color: '#FF5A5F', fontSize: 40, fontWeight: '900', letterSpacing: -1, zIndex: 10 },
  shape: { position: 'absolute', backgroundColor: '#FF5A5F' },
  shapeTop: { width: 300, height: 300, top: -150, left: -100, transform: [{ rotate: '45deg' }] },
  shapeBottom: { width: 400, height: 400, bottom: -200, left: -100, borderRadius: 200 },
  shapeRight: { width: 200, height: 200, top: '40%', right: -100, transform: [{ rotate: '20deg' }] },
});