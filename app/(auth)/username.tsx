import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// --- THEME CONSTANTS BASED ON YOUR JSON ---
const THEME = {
  colors: {
    background: '#F1ECE6',
    textPrimary: '#000000',
    textSecondary: '#A0A0A0',
    error: '#E1494B',
    success: '#4CAF50',
    surface: '#FFFFFF',
  },
  spacing: {
    heroTop: 112,
    inputCardTop: 311,
    errorLabelTop: 431.5,
  }
};

export default function UsernameScreen() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Debounce logic: Wait 600ms after user stops typing to call API
  useEffect(() => {
    const checkUsername = async () => {
      // sample 
        router.push('/notifications');
      // Don't check empty or short usernames
      if (username.length < 3) {
        setStatus('idle');
        setErrorMessage('');
        return;
      }

      setStatus('loading');

      try {
        // REPLACE with your local IP address (e.g., 192.168.1.5)
        // Localhost will not work on a physical device
        const API_URL = 'http://192.168.1.5:3000/api/check-username'; 
        
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        });

        const data = await response.json();

        if (data.available) {
          setStatus('success');
          setErrorMessage('');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          setStatus('error');
          setErrorMessage(data.message || 'username unavailable');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      } catch (error) {
        console.error("API Error", error);
        setStatus('error');
        setErrorMessage('Network connection failed');
      }
    };

    const timer = setTimeout(checkUsername, 600); // Debounce delay
    return () => clearTimeout(timer);
  }, [username]);

  const handleContinue = () => {
    if (status === 'success') {
      router.push('/notifications');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Back Navigation */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={24} color={THEME.colors.textPrimary} />
      </TouchableOpacity>

      {/* 2. Hero Block */}
      <View style={styles.heroBlock}>
        <Text style={styles.emoji}>📱</Text>
        <View style={styles.headlineGroup}>
          <Text style={styles.headline}>Get your username</Text>
          <Text style={styles.subtitle}>
            Usernames are claimed on first{'\n'}come first serve basis
          </Text>
        </View>
      </View>

      {/* 3. Input Card */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputCard}>
          <View style={styles.textGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <TextInput
            placeholder='Enter your username'
              style={styles.input}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setStatus('idle');
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          
          <View style={styles.statusIcon}>
            {status === 'loading' && <ActivityIndicator color={THEME.colors.textPrimary} />}
            {status === 'success' && <Ionicons name="checkmark-circle" size={24} color={THEME.colors.success} />}
            {status === 'error' && <Ionicons name="alert-circle" size={24} color={THEME.colors.error} />}
          </View>
        </View>

        {/* 4. Validation Messages */}
        <View style={styles.messageContainer}>
          {status === 'success' && (
             <Text style={[styles.messageText, { color: THEME.colors.success }]}>
               username available
             </Text>
          )}
          {status === 'error' && (
             <Text style={[styles.messageText, { color: THEME.colors.error }]}>
               {errorMessage}
             </Text>
          )}
        </View>
      </View>

      {/* 5. Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.primaryButton, 
            status !== 'success' && styles.disabledButton // Visually disable if not valid
          ]}
          onPress={handleContinue}
          disabled={status !== 'success'}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  
  // --- Back Button ---
  backButton: {
    position: 'absolute',
    top: 50, // "back_icon_top": 51
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  // --- Hero Block ---
  heroBlock: {
    marginTop: 112, // "hero_top": 112
    alignItems: 'center',
    width: '100%',
  },
  emoji: {
    fontSize: 48, // "size_px": 48
    marginBottom: 15,
  },
  headlineGroup: {
    alignItems: 'center',
    gap: 5,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800', 
    color: THEME.colors.textPrimary,
    letterSpacing: -0.96,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    letterSpacing: -0.24,
  },

  // --- Input Section ---
  inputWrapper: {
    marginTop: 60, // Approximate spacing to match top: 311px relative to screen
    alignItems: 'center',
  },
  inputCard: {
    width: '90%', 
    maxWidth: 381,
    height: 90,
    backgroundColor: THEME.colors.surface,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    marginBottom: 4,
  },
  input: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.colors.textPrimary,
    padding: 0,
  },
  statusIcon: {
    width: 24,
    alignItems: 'center',
  },
  
  // --- Inline Messages ---
  messageContainer: {
    width: '90%',
    maxWidth: 381,
    marginTop: 12, 
    alignItems: 'flex-start',
    paddingLeft: 20,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.28,
  },

  // --- Footer ---
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  primaryButton: {
    width: 140,
    height: 48,
    backgroundColor: '#000000',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(0,0,0,0.2)', // Disabled state style
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  }
});