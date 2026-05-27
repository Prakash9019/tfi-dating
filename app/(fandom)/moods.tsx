import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, FlatList, 
  TouchableOpacity, Image, ActivityIndicator, Dimensions 
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import { PrimaryButton } from '../../components/PrimaryButton';
import { searchTMDB, searchMusic, saveUserMoods } from '../../services/api';

const { width } = Dimensions.get('window');

// --- WIZARD STEPS DEFINITION ---
const WIZARD_STEPS = [
  { type: 'splash', id: 'splash_comfort', title: 'Comfort', color: '#FFD700' }, 
  { type: 'movie', id: 'comfortCinema', title: 'Comfort cinema', subtitle: 'Search and select your most comfort cinema to watch anytime', placeholder: 'movie name' },
  { type: 'song', id: 'comfortSong', title: 'Comfort song', subtitle: 'Search and select your most comfort song to listen and vibe anytime', placeholder: 'song name' },
  { type: 'song', id: 'readyToDance', title: 'Ready to dance', subtitle: 'Search and select your most comfort song to vibe and dance', placeholder: 'song name' },
  { type: 'movie', id: 'lovedFlop', title: 'Loved flop movie', subtitle: 'Search and select your secretly loved flop movie', placeholder: 'movie name' },
  
  { type: 'splash', id: 'splash_nostalgia', title: 'Nostalgia', color: '#4ADE80' }, 
  { type: 'movie', id: 'mostAnticipated', title: 'Most anticipated', subtitle: 'Search and select the film you’re most excited to watch', placeholder: 'movie name' },
  { type: 'movie', id: 'reRelease', title: 'Re-release', subtitle: 'Search and select a film you’re waiting to see re-released', placeholder: 'movie name' },
  { type: 'movie', id: 'firstInTheatre', title: '1st in theatre', subtitle: 'Search and select the first film you watched in a theatre', placeholder: 'movie name' },
  { type: 'movie', id: 'bestInTheatre', title: 'Best in theatre', subtitle: 'Search and select the best movie experience you’ve had in a theatre', placeholder: 'movie name' },
];

export default function MoodsScreen() {
  const [stepIndex, setStepIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentStep = WIZARD_STEPS[stepIndex];

  // --- SPLASH SCREEN AUTO-ADVANCE ---
  useEffect(() => {
    if (currentStep.type === 'splash') {
      const timer = setTimeout(() => {
        setStepIndex(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, currentStep]);

  // --- SEARCH API LOGIC ---
  useEffect(() => {
    if (currentStep.type === 'splash') return;

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (currentStep.type === 'movie') {
          // Fetch from TMDB
          const data = await searchTMDB(query);
          setResults(data.filter((item: any) => item.type === 'movie'));
        } else if (currentStep.type === 'song') {
          // Fetch from iTunes
          const data = await searchMusic(query);
          setResults(data);
        }
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, currentStep]);

  const handleSelect = (item: any) => {
    setAnswers(prev => ({ ...prev, [currentStep.id]: item }));
  };

  const handleContinue = async () => {
    if (stepIndex < WIZARD_STEPS.length - 1) {
      setQuery('');
      setResults([]);
      setStepIndex(prev => prev + 1);
    } else {
      setSaving(true);
      try {
        // Sends the complete Object to backend
        await saveUserMoods(answers); 
        console.log("All moods saved successfully!");
        
        // After finishing, navigate to the main Home Screen
        // router.replace('/(main)/home' as any); 
      } catch (error) {
        console.error("Save error:", error);
      } finally {
        setSaving(false);
      }
    }
  };

  const selectedItem = answers[currentStep.id];

  // ==========================================
  // RENDER: SPLASH SCREEN
  // ==========================================
  if (currentStep.type === 'splash') {
    return (
      <View style={[styles.splashContainer, { backgroundColor: '#000000' }]}>
        <View style={[styles.shape, styles.shapeTop, { backgroundColor: currentStep.color }]} />
        <View style={[styles.shape, styles.shapeBottom, { backgroundColor: currentStep.color }]} />
        <MotiView from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
          <Text style={[styles.splashTitle, { color: currentStep.color }]}>{currentStep.title}</Text>
        </MotiView>
      </View>
    );
  }

  // ==========================================
  // RENDER: SEARCH WIZARD
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <AnimatePresence exitBeforeEnter>
        <MotiView 
          key={stepIndex}
          from={{ opacity: 0, translateX: 20 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -20 }}
          style={styles.header}
        >
          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
        </MotiView>
      </AnimatePresence>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder=""
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              if (selectedItem && text !== selectedItem.name) {
                const newAnswers = { ...answers };
                delete newAnswers[currentStep.id];
                setAnswers(newAnswers);
              }
            }}
          />
          {loading && <ActivityIndicator size="small" color="#000" />}
        </View>
        <Text style={styles.helperText}>Search e.g. ({currentStep.placeholder})</Text>
      </View>

      {/* 3-COLUMN CIRCULAR GRID */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.card} activeOpacity={0.8}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
                
                {isSelected && (
                  <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.selectedOverlay}>
                    <Ionicons name="checkmark" size={32} color="#FFF" />
                  </MotiView>
                )}
              </View>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              {/* Only renders for iTunes songs since TMDB movies don't have artist property here */}
              {item.artist && <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>}
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        {selectedItem && (
          <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }}>
            <PrimaryButton 
              label={stepIndex === WIZARD_STEPS.length - 1 ? "Finish" : "Continue"} 
              onPress={handleContinue} 
              loading={saving} 
            />
          </MotiView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  splashTitle: { fontSize: 44, fontWeight: '900', letterSpacing: -1, zIndex: 10 },
  shape: { position: 'absolute' },
  shapeTop: { width: 300, height: 300, top: -100, left: -100, transform: [{ rotate: '45deg' }] },
  shapeBottom: { width: 400, height: 400, bottom: -150, right: -150, borderRadius: 200 },

  container: { flex: 1, backgroundColor: '#F1ECE6' },
  header: { alignItems: 'center', marginTop: 40, paddingHorizontal: 30, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: '900', color: '#000', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 12, color: '#A0A0A0', textAlign: 'center', lineHeight: 16 },

  searchWrapper: { paddingHorizontal: 24, marginBottom: 10 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, height: 56, paddingHorizontal: 16 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '600', color: '#000' },
  helperText: { fontSize: 10, color: '#A0A0A0', marginTop: 8, marginLeft: 4 },

  listContainer: { paddingBottom: 120, alignItems: 'center', paddingTop: 10 },
  card: { alignItems: 'center', margin: 10, width: (width / 3) - 30 },
  imageContainer: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', marginBottom: 8, backgroundColor: '#DDD' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  selectedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  
  itemName: { fontSize: 12, fontWeight: '700', textAlign: 'center', color: '#000' },
  artistName: { fontSize: 10, fontWeight: '600', textAlign: 'center', color: '#888', marginTop: 2 },
  footer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' }
});