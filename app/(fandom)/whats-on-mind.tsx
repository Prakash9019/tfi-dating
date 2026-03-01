import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CURRENT_USER_ID, saveUserSlogan } from '../../services/api';

export default function WhatsOnMindScreen() {
  // Catch the updated slogan if returning from the write-slogan modal
  const { updatedSlogan } = useLocalSearchParams();
  
  const [currentSlogan, setCurrentSlogan] = useState(updatedSlogan as string || '');
  const [saving, setSaving] = useState(false);
  
  // Mock recent slogans (In a real app, fetch these from backend User profile)
  const [recentSlogans, setRecentSlogans] = useState([
    "Raju lake raju prabhas raju 👑🦖",
    "Ah seal ni puttinchinde vaadu 🦖"
  ]);

  // Update state if returned from modal
  useEffect(() => {
    if (updatedSlogan) {
      setCurrentSlogan(updatedSlogan as string);
    }
  }, [updatedSlogan]);

  const handleSelectRecent = async (slogan: string) => {
    setCurrentSlogan(slogan);
    // Optionally auto-save when they tap a recent one
    await saveUserSlogan( slogan);
  };

  const handleContinue = () => {
    // Navigate to the next screen in your onboarding flow
    router.push('/(fandom)/moods');
    console.log("Proceeding with slogan:", currentSlogan);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's on your mind?</Text>
        <Text style={styles.subtitle}>
          Write your favorite slogan or whatever comes to mind when you think of your bias
        </Text>
      </View>

      {/* Avatar & Speech Bubble Area */}
      <View style={styles.avatarSection}>
        {currentSlogan ? (
          <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={styles.bubbleContainer}>
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleText}>{currentSlogan}</Text>
            </View>
            <View style={styles.bubbleTail} />
          </MotiView>
        ) : null}

        <View style={styles.avatarWrapper}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' }} // Replace with user's bias image
            style={styles.avatar} 
          />
        </View>
      </View>

      {/* Write Your Own Button */}
      <TouchableOpacity 
        style={styles.writeOwnBtn} 
        activeOpacity={0.8}
        onPress={() => router.push('/(fandom)/write-slogan')}
      >
        <Text style={styles.writeOwnText}>✍️ Write your own</Text>
      </TouchableOpacity>

      {/* Recent Slogans List */}
      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>{currentSlogan ? "Most used" : "Recent"}</Text>
        
        {recentSlogans.map((slogan, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.recentCard} 
            onPress={() => handleSelectRecent(slogan)}
          >
            <Text style={styles.recentCardText}>{slogan}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} loading={saving} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECE6' },
  header: { alignItems: 'center', marginTop: 40, paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 13, color: '#A0A0A0', textAlign: 'center', lineHeight: 18 },
  
  // Avatar & Bubble
  avatarSection: { alignItems: 'center', marginTop: 40, marginBottom: 30, position: 'relative' },
  avatarWrapper: {
    width: 140, height: 140, borderRadius: 70, borderWidth: 4, borderColor: '#FFF0DD', overflow: 'hidden'
  },
  avatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  bubbleContainer: { position: 'absolute', top: -30, right: 20, zIndex: 10, maxWidth: 160 },
  speechBubble: { backgroundColor: '#1A1A1A', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 16 },
  bubbleText: { color: '#FFF', fontSize: 12, fontWeight: '700', textAlign: 'center' },
  bubbleTail: { 
    position: 'absolute', bottom: -6, left: 30, width: 16, height: 16, 
    backgroundColor: '#1A1A1A', transform: [{ rotate: '45deg' }] 
  },

  // Write Own Button
  writeOwnBtn: { 
    backgroundColor: '#000', marginHorizontal: 24, height: 60, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 30 
  },
  writeOwnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  // Recent List
  recentSection: { paddingHorizontal: 24 },
  recentTitle: { fontSize: 16, fontWeight: '800', color: '#000', marginBottom: 15 },
  recentCard: { 
    backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 20, 
    borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 
  },
  recentCardText: { fontSize: 14, fontWeight: '700', color: '#000' },

  footer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' }
});