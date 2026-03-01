import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { PrimaryButton } from '../../components/PrimaryButton';
import { api, CURRENT_USER_ID, fetchActors, saveUserBias } from '../../services/api';

export default function BiasScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedActor, setSelectedActor] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Debounced Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchActors(query);
        console.log('Search results:', data);
        setResults(data);
      } catch (err) {
        console.log('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (actor: any) => {
    setSelectedActor(actor);
  };

  const handleContinue = async () => {
    if (!selectedActor) return;

    // console.log(selectedActor);
    setSaving(true);
    try {
      await saveUserBias( {
        actorId: selectedActor.id,
        name: selectedActor.name,
        image: selectedActor.image
      });
      // Pass the actor info to the next screen via query params
      router.push({
        pathname: '/(fandom)/top-movies',
        params: { actorId: selectedActor.id, actorName: selectedActor.name }
      });
    } catch (error) {
      console.log('Error saving bias', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your bias</Text>
        <Text style={styles.subtitle}>Search and select your favourite Telugu artist as your bias in the industry</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#000" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Prabhas"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setSelectedActor(null); // Reset selection if typing again
          }}
        />
        {loading && <ActivityIndicator style={styles.loader} color="#000" />}
      </View>

      <Text style={styles.helperText}>Search e.g. (Artist name or Movie name)</Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selectedActor?.id === item.id;
          return (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
                
                {/* The Blur/Checkmark Animation */}
                {isSelected && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.selectedOverlay}
                  >
                    <Ionicons name="checkmark" size={32} color="#FFF" />
                  </MotiView>
                )}
              </View>
              <Text style={styles.actorName} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        {selectedActor && (
          <MotiView from={{ translateY: 20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }}>
            <PrimaryButton label="Continue" onPress={handleContinue} loading={saving} />
          </MotiView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECE6', paddingHorizontal: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 8 },
  subtitle: { fontSize: 12, color: '#888', textAlign: 'center', maxWidth: 250, lineHeight: 18 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, height: 56, paddingHorizontal: 16, marginBottom: 12 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '600' },
  loader: { marginLeft: 10 },
  helperText: { fontSize: 10, color: '#A0A0A0', marginBottom: 20 },
  list: { paddingBottom: 100 },
  card: { alignItems: 'center', margin: 10, width: 90 },
  imageContainer: { width: 80, height: 80, borderRadius: 40, overflow: 'hidden', marginBottom: 8 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  selectedOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(168, 107, 72, 0.8)', justifyContent: 'center', alignItems: 'center' },
  actorName: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  footer: { position: 'absolute', bottom: 40, width: '100%', alignSelf: 'center', alignItems: 'center' }
});