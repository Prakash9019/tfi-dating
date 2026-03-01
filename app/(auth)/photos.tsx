import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

import { COLORS } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';

// --- THEME CONSTANTS ---
const SCREEN_BG = '#F1ECE6';
const TEXT_ERROR = '#E1494B';

const MOCK_PHOTOS = [
  { uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', status: 'ok' },
  { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', status: 'ok' },
  { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', status: 'bad' }
];

// --- ANIMATION CALCS ---
const CARD_WIDTH = 100;
const GAP = 12;
const ITEM_WIDTH = CARD_WIDTH + GAP;
// The width of exactly one complete set of our mock photos
const SINGLE_SET_WIDTH = ITEM_WIDTH * MOCK_PHOTOS.length; 

const PhotoCard = ({ uri, status }: any) => (
  <View style={styles.card}>
    <Image source={{ uri }} style={styles.image} />
    <View style={[styles.badge, { backgroundColor: status === 'ok' ? '#4CAF50' : TEXT_ERROR }]}>
      <Ionicons name={status === 'ok' ? "checkmark" : "close"} size={10} color="white" />
    </View>
  </View>
);

export default function PhotosScreen() {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  
  // --- INFINITE SLIDE ANIMATION LOGIC ---
  const translateX = useSharedValue(0);

  useEffect(() => {
    // We animate from 0 to the exact negative width of ONE set of photos.
    // By duplicating the array, this creates a seamless, infinite loop.
    translateX.value = withRepeat(
      withTiming(-SINGLE_SET_WIDTH, {
        duration: 4000, // Speed of the slide (lower = faster)
        easing: Easing.linear, // Linear easing ensures consistent speed
      }),
      -1, // -1 means infinite repeat
      false // Do not reverse, keep going left
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });
  // --------------------------------------

  const handleUpload = async () => {
    Alert.alert(
      "Add a pic",
      "It can be anything, but pics of you get a verification boost on EQUALS!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Take a selfie", onPress: openCamera },
        { text: "Choose from library", onPress: openLibrary }
      ]
    );
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    handleImageSelection(result);
  };

  const openLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    handleImageSelection(result);
  };

  const handleImageSelection = (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      router.push({
        pathname: '/(main)/verification-start',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  // We render 3 sets of the photos side-by-side to ensure the screen is 
  // always filled with images, making the infinite wrap look invisible.
  const infinitePhotos = [...MOCK_PHOTOS, ...MOCK_PHOTOS, ...MOCK_PHOTOS];

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <MotiView from={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Text style={styles.emoji}>📷</Text>
        </MotiView>
        <Text style={styles.title}>Add your cool pic</Text>
        <Text style={styles.subtitle}>Make sure the picture is yours to get your profile verified</Text>
      </View>

      {/* 2. INFINITE SLIDING PHOTO MARQUEE */}
      <View style={styles.sliderContainer}>
        {/* Fade edges slightly to make the scrolling look cleaner (Optional visual polish) */}
        <MotiView 
          from={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          delay={300} 
          style={styles.fadeContainer}
        >
          <Animated.View style={[styles.sliderRow, animatedStyle]}>
            {infinitePhotos.map((photo, index) => (
              <PhotoCard 
                key={`${index}-${photo.uri}`} 
                uri={photo.uri} 
                status={photo.status} 
              />
            ))}
          </Animated.View>
        </MotiView>
      </View>

      {/* 3. Footer Actions */}
      <View style={styles.footer}>
        <PrimaryButton 
          label="Upload now" 
          onPress={handleUpload} 
          style={{ width: 146 }}
        />
        
        <View style={styles.warning}>
          <Ionicons name="alert-circle" size={14} color={TEXT_ERROR} />
          <Text style={styles.warningText}>Avoid NSFW or inappropriate content</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: SCREEN_BG 
  },
  header: { 
    alignItems: 'center', 
    marginTop: 60, 
    paddingHorizontal: 30,
    zIndex: 10
  },
  emoji: { 
    fontSize: 48, 
    marginBottom: 16 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Metropolis-ExtraBold', 
  },
  subtitle: { 
    textAlign: 'center', 
    color: '#A0A0A0', 
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16
  },
  
  // --- SLIDER STYLES ---
  sliderContainer: {
    marginTop: 40,
    width: '100%',
    overflow: 'hidden', // Hides the images as they slide off-screen
    height: 140, // Enough height for the cards + shadow/padding
    justifyContent: 'center',
  },
  fadeContainer: {
    width: '100%',
    flexDirection: 'row',
  },
  sliderRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: GAP, 
    // Need a tiny bit of padding so shadows aren't clipped
    paddingHorizontal: GAP, 
  },
  card: { 
    width: CARD_WIDTH, 
    height: 120, 
    borderRadius: 16, 
    overflow: 'hidden',
    backgroundColor: '#D9D9D9'
  },
  image: { 
    width: '100%', 
    height: '100%',
    resizeMode: 'cover'
  },
  badge: { 
    position: 'absolute', 
    bottom: 8, 
    right: 8, 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF'
  },
  
  // --- FOOTER STYLES ---
  footer: { 
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 20
  },
  warning: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  },
  warningText: { 
    color: TEXT_ERROR, 
    fontSize: 11, 
    fontWeight: '600' 
  }
});