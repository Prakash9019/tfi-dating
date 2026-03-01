import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { COLORS } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function NotificationsScreen() {

  // Function to request actual system permissions
  const requestPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      console.log(status)
      // Regardless of choice (Allow/Deny), we move to the next screen 
      // just like in the video flow after interaction.
      if (status) {
        router.push('/photos');
      }
    } catch (error) {
      console.log('Error requesting permissions:', error);
      // Fallback navigation if something fails
      router.push('/photos');
    }
  };

  // Trigger the pop-up immediately when screen opens
  useEffect(() => {
    // Small delay to ensure screen transition is finished before pop-up
    const timer = setTimeout(() => {
      requestPermissions();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📢</Text>
        <Text style={styles.title}>Stay in the loop</Text>
        <Text style={styles.subtitle}>
          Get notified when someone adds you, texts you or react to your profile
        </Text>
        
        {/* --- VISUAL PRIMER (The "Fake" Alert from Design) --- */}
        {/* This stays in background while real system alert pops over it */}
        {/* <View style={styles.visualAlertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>
              Turn on Push Notifications to Allow Message Alerts
            </Text>
            <Text style={styles.alertBody}>
              League notifies you when someone wants to message you
            </Text>
            <View style={styles.alertButtons}>
              <View style={styles.alertBtn}>
                <Text style={styles.alertBtnTextBlue}>Don't Allow</Text>
              </View>
              <View style={[styles.alertBtn, styles.borderLeft]}>
                <Text style={[styles.alertBtnTextBlue, styles.boldText]}>Allow</Text>
              </View>
            </View>
          </View>
          <Text style={styles.pointer}>👆</Text>
        </View> */}
      </View>
      
      <View style={styles.footer}>
        {/* Manual trigger button in case they missed the auto-pop-up */}
        <PrimaryButton label="Enable" onPress={requestPermissions} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30 
  },
  emoji: { 
    fontSize: 60, 
    marginBottom: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    marginBottom: 10,
    color: '#000',
    textAlign: 'center'
  },
  subtitle: { 
    textAlign: 'center', 
    color: COLORS.text.secondary, 
    lineHeight: 20, 
    marginBottom: 40,
    maxWidth: '80%'
  },
  
  // --- Fake Alert Styles (Visual only) ---
  visualAlertContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBox: {
    backgroundColor: 'rgba(255,255,255,0.95)', 
    borderRadius: 14, 
    width: 270,
    alignItems: 'center', 
    paddingTop: 20,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, 
    shadowRadius: 12,
    elevation: 5,
  },
  alertTitle: { 
    fontWeight: '700', 
    fontSize: 17, 
    textAlign: 'center', 
    marginBottom: 5, 
    paddingHorizontal: 16,
    lineHeight: 22
  },
  alertBody: { 
    fontSize: 13, 
    textAlign: 'center', 
    marginBottom: 15, 
    paddingHorizontal: 10,
    lineHeight: 18
  },
  alertButtons: { 
    flexDirection: 'row', 
    borderTopWidth: 0.5, 
    borderColor: '#3F3F3F40', 
    width: '100%' 
  },
  alertBtn: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  borderLeft: { 
    borderLeftWidth: 0.5, 
    borderColor: '#3F3F3F40' 
  },
  alertBtnTextBlue: { 
    color: '#007AFF', 
    fontSize: 17 
  },
  boldText: {
    fontWeight: '600'
  },
  pointer: { 
    position: 'absolute', 
    bottom: -35, 
    right: 50, 
    fontSize: 45,
    transform: [{ rotate: '-10deg' }]
  },
  
  footer: { 
    padding: 40,
    paddingBottom: 50
  }
});