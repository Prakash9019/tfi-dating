import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function ErrorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.nav}>
        <Ionicons name="chevron-back" size={24} onPress={() => router.push('/camera')} />
      </View>

      <View style={styles.content}>
        <Text style={styles.emoji}>😓</Text>
        <Text style={styles.title}>Selfie Doesn't Match</Text>
        <Text style={styles.subtitle}>
          We think your selfie doesn't match the profile photos on your account. 
          This helps us keep LEAGUE safe for everyone. If this is a mistake, 
          please try again with a clear, well-lit photo.
        </Text>
        
        <PrimaryButton 
          label="Try again" 
          onPress={() => router.push('/camera')} 
          style={{ width: 140, marginTop: 30 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  nav: { padding: 20 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, marginTop: -50 },
  emoji: { fontSize: 60, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 15 },
  subtitle: { textAlign: 'center', color: COLORS.text.secondary, lineHeight: 20, fontSize: 13 }
});