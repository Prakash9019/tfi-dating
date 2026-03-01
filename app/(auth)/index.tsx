import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, LAYOUT } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { MotiView } from 'moti';

// Updated InputField to handle state changes
const InputField = ({ label, placeholder, value, onChangeText }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText} // Bind state update
        placeholderTextColor="#C0C0C0"
      />
    </View>
  </View>
);

export default function IntroScreen() {
  // 1. State for form fields
  const [formData, setFormData] = useState({
    nickname: '', // Default value from your example
    city: '',
    gender: '',
    birthday: ''
  });
  const [loading, setLoading] = useState(false);

  // 2. Helper to update specific fields
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 3. Submit Handler
  const handleSubmit = async () => {
    // sample 
     router.push('/username');
    // Basic validation
    if (!formData.nickname || !formData.city || !formData.gender || !formData.birthday) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      // REPLACE with your actual computer IP address (e.g., 192.168.1.5:3000)
      // localhost won't work on Android emulator/Physical device
      const API_URL = 'http://YOUR_LOCAL_IP:3000/api/intro'; 

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success: Navigate to next screen
        router.push('/username');
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <MotiView 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }}
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>👋</Text>
            <Text style={styles.title}>Introduce yourself</Text>
            <Text style={styles.subtitle}>(try to be anonymous for fun)</Text>
          </View>

          <View style={styles.form}>
            <InputField 
              label="Nickname" 
              placeholder="Enter nickname" 
              value={formData.nickname}
              onChangeText={(text: string) => handleInputChange('nickname', text)}
            />
            <InputField 
              label="City" 
              placeholder="City" 
              value={formData.city}
              onChangeText={(text: string) => handleInputChange('city', text)}
            />
            <InputField 
              label="Gender" 
              placeholder="Select" 
              value={formData.gender}
              onChangeText={(text: string) => handleInputChange('gender', text)}
            />
            <InputField 
              label="Birthday" 
              placeholder="DD/MM/YYYY" 
              value={formData.birthday}
              onChangeText={(text: string) => handleInputChange('birthday', text)}
            />
          </View>
        </MotiView>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          label="Continue" 
          onPress={handleSubmit} 
          loading={loading} // Pass loading state to button
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: LAYOUT.padding },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '800' },
  subtitle: { fontSize: 14, color: COLORS.text.secondary, marginTop: 4 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  inputContainer: {
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: LAYOUT.radius.input,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  input: { fontSize: 16, fontWeight: '500' },
  footer: { padding: LAYOUT.padding, paddingBottom: 40 }
});