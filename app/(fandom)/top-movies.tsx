import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList, { ScaleDecorator, RenderItemParams } from 'react-native-draggable-flatlist';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CURRENT_USER_ID, fetchActorMovies, saveTopMovies } from '../../services/api';

export default function TopMoviesScreen() {
  const { actorId, actorName } = useLocalSearchParams();
  // We now use a single array for ALL movies to allow dragging anywhere
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const fetchedMovies = await fetchActorMovies(actorId as string);
        // Load top 20 movies so the list is scrollable but not overwhelming
        setMovies(fetchedMovies.slice(0, 20)); 
      } catch (error) {
        console.log("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [actorId]);

  const handleContinue = async () => {
    setSaving(true);
    try {
      // Slice the top 3 from our single array to save to the backend
      const topThree = movies.slice(0, 3).map(m => ({ 
        movieId: m.id, 
        title: m.title, 
        poster: m.poster 
      }));
      
      // Ensure you pass the userId if your API requires it
      await saveTopMovies( topThree); 
      console.log('Saved successfully!');
      
      router.push('/(fandom)/whats-on-mind'); // Navigate to next screen
    } catch (error) {
      console.log("Error saving:", error);
    } finally {
      setSaving(false);
    }
  };

  // --- Dynamic Render Item --- 
  // Transforms based on whether it is currently in the Top 3 or below
  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<any>) => {
    const index = getIndex() || 0;
    const isTop3 = index < 3;
    const rank = index + 1;
    
    // Top 3 Color Logic
    let rankColor = '#FFFFFF'; // Default 3rd place white
    if (rank === 1) rankColor = '#FFB800'; // Gold
    if (rank === 2) rankColor = '#FF7A00'; // Orange

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          activeOpacity={0.9}
          style={[
            isTop3 ? styles.premiumCard : styles.ordinaryCard,
            isActive && styles.cardActive // Slight pop effect when actively dragging
          ]}
        >
          {isTop3 ? (
            // --- PREMIUM TOP 3 CARD ---
            <>
              <Text style={[styles.premiumRankText, { color: rankColor }]}>#{rank}</Text>
              <Text style={[styles.premiumMovieTitle, { color: rankColor }]} numberOfLines={1}>
                {item.title}
              </Text>
            </>
          ) : (
            // --- ORDINARY MOVIE CARD ---
            <>
              <View style={styles.ordinaryLeft}>
                <Ionicons name="menu-outline" size={24} color="#A0A0A0" style={styles.dragHandle} />
                <Image 
                  source={{ uri: item.poster || 'https://via.placeholder.com/50' }} 
                  style={styles.ordinaryPoster} 
                />
                <Text style={styles.ordinaryMovieTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.ordinaryRankText}>{rank}</Text>
            </>
          )}
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MotiView 
        from={{ opacity: 0, translateY: -20 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        style={styles.header}
      >
        <Text style={styles.title}>Select your top 3{'\n'}movies of {actorName}</Text>
        <Text style={styles.subtitle}>Drag any movie to the top to rank your favorites!</Text>
      </MotiView>

      {/* FULLY SCROLLABLE DRAG LIST */}
      <View style={styles.listContainer}>
        <DraggableFlatList
          data={movies}
          onDragEnd={({ data }) => setMovies(data)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          animationConfig={{ damping: 20, stiffness: 250 }} // Snappy animation
        />
      </View>

      {/* FLOATING FOOTER */}
      <MotiView 
        from={{ opacity: 0, translateY: 50 }} 
        animate={{ opacity: 1, translateY: 0 }}
        delay={300}
        style={styles.footer}
      >
        <PrimaryButton label="Continue" onPress={handleContinue} loading={saving} />
      </MotiView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECE6' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1ECE6' },
  
  header: { alignItems: 'center', marginTop: 20, marginBottom: 10, paddingHorizontal: 30 },
  title: { fontSize: 26, fontWeight: '900', textAlign: 'center', marginBottom: 8, lineHeight: 32 },
  subtitle: { fontSize: 12, color: '#A0A0A0', textAlign: 'center', lineHeight: 18 },

  listContainer: {
    flex: 1, // Takes up remaining space so it's fully scrollable
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 120, // Extra padding so last item isn't hidden behind the button
  },
  
  // --- Animation States ---
  cardActive: {
    opacity: 0.85,
    transform: [{ scale: 1.03 }],
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, elevation: 10,
    zIndex: 999,
  },

  // --- Premium Top 3 Card Styles ---
  premiumCard: {
    height: 90,
    backgroundColor: '#000000',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  premiumRankText: {
    fontSize: 40,
    fontWeight: '900',
    fontStyle: 'italic', 
  },
  premiumMovieTitle: {
    fontSize: 18,
    fontWeight: '700',
    maxWidth: '65%',
    textAlign: 'right',
  },

  // --- Ordinary Card Styles (Index 3+) ---
  ordinaryCard: {
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  ordinaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dragHandle: {
    marginRight: 10,
  },
  ordinaryPoster: {
    width: 35,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: '#DDD',
  },
  ordinaryMovieTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    paddingRight: 10,
  },
  ordinaryRankText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#D0D0D0',
  },

  // --- Footer ---
  footer: { 
    position: 'absolute', 
    bottom: 40, 
    width: '100%', 
    alignItems: 'center',
    // Slight shadow to separate button from scrolling list behind it
    shadowColor: '#F1ECE6', shadowOpacity: 1, shadowRadius: 20, shadowOffset: { width: 0, height: -20 }
  }
});