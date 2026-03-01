import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {  saveUserSlogan } from '../../services/api';

export default function WriteSloganScreen() {
  const [slogan, setSlogan] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!slogan.trim()) return;
    setSaving(true);
    try {
      await saveUserSlogan( slogan);
      router.navigate({
        pathname: '/(fandom)/whats-on-mind',
        params: { updatedSlogan: slogan }
      });
    } catch (error) {
      console.log('Error saving slogan', error);
      setSaving(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.overlay}>
        
        {/* iOS needs padding, Android naturally resizes the window (no behavior needed to prevent smushing) */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
          style={styles.keyboardWrapper}
        >
          {/* The Dark Bottom Sheet */}
          <View style={styles.sheetContainer}>
            
            {/* Top Drag Handle Floating above the black edge slightly */}
            <View style={styles.dragHandle} />

            {/* Absolute Positioned Back Button (Never collides with center content) */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Centered Content (Avatar + Bubble + Save) */}
            <View style={styles.centerContent}>
              
              <View style={styles.avatarGroup}>
                {/* Note Bubble (Anchored to top-right of Avatar) */}
                <View style={styles.bubbleWrapper}>
                  <View style={styles.speechBubble}>
                    <TextInput
                      style={styles.input}
                      placeholder="What's on your mind?"
                      placeholderTextColor="#A0A0A0"
                      value={slogan}
                      onChangeText={setSlogan}
                      autoFocus
                      multiline
                      maxLength={60}
                      textAlign="center"
                    />
                  </View>
                  {/* The small triangle pointing to the avatar */}
                  <View style={styles.bubbleTail} />
                </View>

                {/* Main Avatar */}
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e' }} 
                  style={styles.avatar} 
                />
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                style={[styles.saveBtn, !slogan.trim() && styles.saveBtnDisabled]} 
                onPress={handleSave} 
                disabled={saving || !slogan.trim()}
              >
                <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>

            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // Dimmed background
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end',
  },
  keyboardWrapper: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes the sheet to the bottom
  },
  
  // The Black Modal Sheet
  sheetContainer: {
    backgroundColor: '#100F0A', // Exact dark color from mockup
    height: '85%', // Fixed height so it doesn't smush
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: '100%',
    position: 'relative',
  },

  // Drag Handle
  dragHandle: {
    width: 45,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
    opacity: 0.9,
  },

  // Back Button (Anchored Top-Left)
  backBtn: { 
    position: 'absolute',
    top: 30,
    left: 24,
    width: 44, 
    height: 44, 
    backgroundColor: '#FFF', 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 50, // Stays above everything
  },

  // Centered Container for Avatar and Save Button
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40, // Offset for keyboard
  },

  // Avatar + Note Group
  avatarGroup: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },

  // Avatar Styling
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: '#F1ECE6', // Beige border matching the mockup
    resizeMode: 'cover',
  },

bubbleWrapper: {
  position: 'absolute',
  top: -40,
  left: '15%',
  transform: [{ translateX: 20 }], 
  zIndex: 20,
  maxWidth: 150,
},
  speechBubble: {
    backgroundColor: '#262626', // Dark grey bubble
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3A3A3A',
    minHeight: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    alignSelf: 'flex-start',
  },
  input: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    padding: 0,
    margin: 0,
    textAlignVertical: 'center', 
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -7,
    left: 40, // Tail positioned over the right side of avatar
    width: 14,
    height: 14,
    backgroundColor: '#262626',
    transform: [{ rotate: '45deg' }],
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#3A3A3A',
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 100,
    minWidth: 140,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  }
});