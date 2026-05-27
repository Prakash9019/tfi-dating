import React,{ useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,Dimensions, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { BlurView } from 'expo-blur';
// --- THEME CONSTANTS ---
const SCREEN_BG = '#F1ECE6';
const BORDER_COLOR = '#FFF0DD';
const TICK_COLOR = '#4CAF50'; // Green for initial selection
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

export default function VerificationStartScreen() {
  const { imageUri } = useLocalSearchParams();
    const { height } = useWindowDimensions();
  const [showGuide, setShowGuide] = useState(false);
  // Use dummy image if none selected yet
  const displayImage = imageUri ? (imageUri as string) : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e';

  const handleChangePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      router.replace({
        pathname: '/(main)/verification-start',
        params: { imageUri: result.assets[0].uri }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headline}>Get your profile verified</Text>
        <Text style={styles.subtitle}>
          Make sure the picture is yours to get your profile verified
        </Text>
      </View>

      <View style={styles.content}>
        <MotiView 
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.cardWrapper}
        >
          {/* --- UPDATED BADGE WITH IMAGE --- */}
          {/* <View style={styles.imageBadgeContainer}>
            <Image source={{ uri: displayImage }} style={styles.badgeImage} />
            <View style={styles.badgeTick}>
               <Ionicons name="checkmark" size={10} color="white" />
            </View>
          </View> */}
            <TouchableOpacity style={styles.floatingStartBtn}>
              <Text style={styles.floatingStartText}>Get started</Text>
            </TouchableOpacity>

          <Image source={{ uri: displayImage }} style={styles.mainImage} />
          
          <TouchableOpacity style={styles.changeBtn} activeOpacity={0.8} onPress={handleChangePhoto}>
            <Text style={styles.changeBtnText}>Change photo</Text>
          </TouchableOpacity>
        </MotiView>

        {/* Blurred Background Visual */}
        <View style={styles.blurContainer}>
           <Image source={{ uri: displayImage }} style={styles.blurImage} blurRadius={30} />
           <View style={styles.verifyBtnWrapper}>
             <PrimaryButton 
               label="Get verified" 
               variant="white"
               style={styles.verifyBtn}
              //  onPress={() => router.push({
              //    pathname: '/(main)/verification-guide',
              //    params: { imageUri: displayImage } // Pass image to guide
              //  })}
              onPress={() => setShowGuide(true)}
             />
           </View>
        </View>
      </View>
      {showGuide && (
  <View style={[StyleSheet.absoluteFillObject, { zIndex: 50 }]}>

    {/* Light blur + dim */}
    {/* <BlurView intensity={20} style={StyleSheet.absoluteFillObject}>
      <View style={styles.dimLayer} />
    </BlurView> */}
    <BlurView intensity={12} tint="dark" style={StyleSheet.absoluteFillObject}></BlurView>

  <MotiView
  from={{ translateY: height }}
  animate={{ translateY: 0 }}
  transition={{ type: 'timing', duration: 320 }}
  style={styles.bottomSheet}
>

  <View style={styles.dragHandle} />

  {/* Hero avatar */}
  <View style={styles.avatarWrapper}>
    <Image source={{ uri: displayImage }} style={styles.avatar} />
    <View style={styles.statusBadge}>
     <Ionicons name="checkmark" size={14} color="#000" />

    </View>
  </View>

  <Text style={styles.sheetHeadline}>Quick verification</Text>
  <Text style={styles.sheetSubtext}>
    Follow these simple steps to verify your profile
  </Text>

  {/* Checklist */}
  <View style={styles.checklistContainer}>
    <ChecklistItem label="Stand in a well lit area" />
    <ChecklistItem label="Remove hats or caps" />
    <ChecklistItem label="Keep glasses if needed" />
  </View>

  <PrimaryButton
    label="Get started"
    onPress={() => router.push('/(main)/camera')}
    style={styles.actionButton}
    labelStyle={styles.actionButtonLabel}
  />

</MotiView>
  </View>
)}
    </SafeAreaView>
  );
}
const ChecklistItem = ({ label }: { label: string }) => (
  <View style={styles.checkRow}>
    <Ionicons name="checkmark-circle" size={20} color={THEME.colors.textInverse} />
    <Text style={styles.checkText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: SCREEN_BG },
  header: { marginTop: 40, alignItems: 'center', paddingHorizontal: 40, marginBottom: 30 },
  headline: { fontSize: 24, fontWeight: '800', color: '#000', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 12, color: '#A0A0A0', textAlign: 'center', lineHeight: 16, fontWeight: '600' },
  content: { alignItems: 'center', position: 'relative', height: 500 },

  // --- Main Card ---
  cardWrapper: {
    width: 342, height: 252, borderRadius: 30, borderWidth: 3,
    borderColor: BORDER_COLOR, overflow: 'hidden', backgroundColor: '#D9D9D9',
    zIndex: 10, position: 'absolute', top: 0,
  },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  // --- NEW IMAGE BADGE STYLES ---
  imageBadgeContainer: {
    position: 'absolute', top: 15, right: 15, zIndex: 20,
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#DDD'
  },
  badgeImage: { width: '100%', height: '100%', borderRadius: 16 },
  badgeTick: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: TICK_COLOR, width: 14, height: 14,
    borderRadius: 7, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#FFF'
  },

  changeBtn: {
    position: 'absolute', bottom: 20, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 100,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },
  changeBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  // --- Blur Section ---
  blurContainer: {
    position: 'absolute', top: 260, width: 342, height: 252,
    borderRadius: 30, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  blurImage: { width: '100%', height: '100%', opacity: 0.6 },
  verifyBtnWrapper: { position: 'absolute' },
  verifyBtn: { width: 146, height: 48, backgroundColor: '#FFFFFF' },
  dimLayer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.25)',
},

bottomSheet: {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '55%',
  backgroundColor: '#100F0A',
  borderTopLeftRadius: 40,
  borderTopRightRadius: 40,
  paddingTop: 50,
  paddingHorizontal: 28,
  paddingBottom: 30,
   zIndex: 100,
},

sheetHeadline: {
  color: '#FFF',
  fontSize: 24,
  fontWeight: '800',
  marginTop: 10,
  textAlign: 'center',
},

sheetSubtext: {
  color: '#9B9B9B',
  fontSize: 13,
  marginTop: 6,
  marginBottom: 30,
  textAlign: 'center',
},

dragHandle: {
  width: 40,
  height: 4,
  backgroundColor: '#333',
  borderRadius: 100,
  alignSelf: 'center',
  marginBottom: 20,
},

sheetTitle: {
  color: 'white',
  fontSize: 20,
  marginBottom: 20,
},

avatarWrapper: {
  alignSelf: 'center',
  marginTop: -45,   // Instead of position absolute
  marginBottom: 10,
},

avatar: {
  width: 90,
  height: 90,
  borderRadius: 45,
  borderWidth: 5,
  borderColor: '#100F0A',
},
 statusBadge: {
  position: 'absolute',
  bottom: 6,
  right: 6,
  backgroundColor: '#D75C7C',
  width: 26,
  height: 26,
  borderRadius: 13,
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#100F0A',
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
  },
  floatingStartBtn: {
  position: 'absolute',
  top: 14,
  right: 14,
  backgroundColor: '#FFFFFF',
  paddingHorizontal: 14,
  paddingVertical: 6,
  borderRadius: 16,
},

floatingStartText: {
  fontSize: 12,
  fontWeight: '700',
  color: '#000',
},
});