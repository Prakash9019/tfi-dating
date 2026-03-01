import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, LAYOUT } from '../constants/theme';
import * as Haptics from 'expo-haptics';

export const PrimaryButton = ({ label, onPress, loading, style, variant = 'primary' }: any) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      disabled={loading}
      style={[
        styles.button, 
        variant === 'white' && styles.whiteButton,
        style
      ]}
    >
      {loading ? <ActivityIndicator color="#FFF" /> : (
        <Text style={[styles.label, variant === 'white' && styles.whiteLabel]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.button.primary,
    height: 56,
    borderRadius: LAYOUT.radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    width: 160,
    alignSelf: 'center',
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5'
  },
  label: {
    color: COLORS.button.text,
    fontSize: 16,
    fontWeight: '700',
  },
  whiteLabel: {
    color: '#000'
  }
});