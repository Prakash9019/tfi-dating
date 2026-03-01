import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useWindowDimensions } from 'react-native';
// --- THEME CONSTANTS FROM JSON ---
const THEME = {
  colors: {
    overlay: 'rgba(0,0,0,0.5)', // Darker overlay for better contrast
    sheetBg: '#100F0A', // "bottom_sheet": "#100F0A"
    accentPink: '#F77CAB', // "primary_pink": "#F77CAB"
    badgePink: '#D75C7C', // "badge_pink": "#D75C7C"
    textInverse: '#FFFFFF',
    textSecondary: '#A0A0A0',
  },
  layout: {
    sheetRadius: 40, // "radius_top_px": 40
  },
  typography: {
    headline: { fontFamily: 'Metropolis-ExtraBold', fontSize: 24 },
    subtitle: { fontFamily: 'Metropolis-SemiBold', fontSize: 12 },
    button: { fontFamily: 'Metropolis-Bold', fontSize: 14 },
    helper: { fontFamily: 'Metropolis-SemiBold', fontSize: 10 },
  }
};

const { height } = Dimensions.get('window');

export default function VerificationGuideScreen() {
  const { height } = useWindowDimensions();
  const { imageUri } = useLocalSearchParams();
  const displayImage = imageUri ? (imageUri as string) : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e';

  return (
    <View style={styles.container}>
      {/* 1. Background Overlay (Dimmed previous screen) */}
      <View style={styles.backgroundContainer}>
        <Image 
          source={{ uri: displayImage }} 
          style={styles.bgImage} 
          blurRadius={15} // "blurred_image": "blur(20px)"
        />
        <View style={styles.dimLayer} />
      </View>

      {/* 2. Bottom Sheet Modal */}
      {/* Animating from bottom for that "modal open" feel */}
     <MotiView
  from={{ translateY: height }}
  animate={{ translateY: 0 }}
  transition={{
    type: 'timing',
    duration: 350,
  }}
  style={styles.bottomSheet}
>
        {/* Drag Handle */}
        <View style={styles.dragHandle} />

        {/* Avatar / Verification Icon */}
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: displayImage }} style={styles.avatar} />
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark" size={12} color="white" />
          </View>
        </View>

        {/* Content Stack */}
        <View style={styles.contentStack}>
          {/* Checklist */}
          <View style={styles.checklistContainer}>
             <ChecklistItem label="Find a light area" />
             <ChecklistItem label="Remove any hats" />
             <ChecklistItem label="Keep your glasses on" />
          </View>

          {/* Helper / Disclaimer Text */}
          <Text style={styles.helperText}>
            It will take less than 60secs and helps us keep LEAGUE fun and safe place for all of our users.
          </Text>

          {/* Get Started Button */}
          <PrimaryButton 
            label="Get started" 
            onPress={() => router.push('/(main)/camera')} 
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
          />
        </View>
      </MotiView>
    </View>
  );
}

// Helper Component for Checklist Item
const ChecklistItem = ({ label }: { label: string }) => (
  <View style={styles.checkRow}>
    <Ionicons name="checkmark-circle" size={20} color={THEME.colors.textInverse} />
    <Text style={styles.checkText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-end', // Aligns modal to bottom
  },
  
  // --- Background ---
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.overlay,
  },

  // --- Bottom Sheet ---
  bottomSheet: {
    backgroundColor: THEME.colors.sheetBg,
    borderTopLeftRadius: THEME.layout.sheetRadius,
    borderTopRightRadius: THEME.layout.sheetRadius,
    paddingHorizontal: 30,
    paddingBottom: 50,
    paddingTop: 15,
    alignItems: 'center',
    width: '100%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333', // Subtle handle
    borderRadius: 100,
    marginBottom: 40,
  },

  // --- Avatar Section ---
  avatarWrapper: {
    marginTop: -80, // Pops out of the sheet slightly or sits at top
    marginBottom: 30,
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: THEME.colors.sheetBg, // Matches sheet bg to look like cutout
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: THEME.colors.badgePink,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.sheetBg,
  },

  // --- Content ---
  contentStack: {
    width: '100%',
    alignItems: 'center',
    gap: 25, // "gap_px": 20 approx
  },
  checklistContainer: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    gap: 15, // "gap_px": 15
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkText: {
    color: THEME.colors.textInverse,
    fontSize: 14,
    fontWeight: '600',
    // fontFamily: 'Metropolis-SemiBold'
  },
  helperText: {
    color: '#888', // Muted text
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    maxWidth: 260,
    marginTop: 10,
    // fontFamily: 'Metropolis-SemiBold'
  },

  // --- Button ---
  actionButton: {
    backgroundColor: THEME.colors.accentPink, // "#F77CAB"
    width: '100%',
    marginTop: 10,
    height: 50,
  },
  actionButtonLabel: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  }
});