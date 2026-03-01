import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '../../components/PrimaryButton';
import { signupUser } from '../../services/api';
import { saveToken } from '../../services/authStorage';
export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }
    
    setLoading(true);
    try {
      const data = await signupUser(name, email, password);
      if (data.success) {
        await saveToken(data.token);
        // In a real app, save data.token to SecureStore here
        router.replace('/(auth)/index' as any);
      }
    } catch (error: any) {
      Alert.alert("Signup Failed", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the fandom and verify your profile</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Surya" autoCapitalize="words" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="surya@example.com" keyboardType="email-address" autoCapitalize="none" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Sign Up" onPress={handleSignup} loading={loading} style={{ width: '100%' }} />
        
        <TouchableOpacity style={styles.switchBtn} onPress={() => router.push('/(auth)/login' as any)}>
          <Text style={styles.switchText}>Already have an account? <Text style={{fontWeight: 'bold', color: '#000'}}>Log In</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1ECE6', paddingHorizontal: 24 },
  backBtn: { marginTop: 20, marginBottom: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  emoji: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: '900', color: '#000', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#A0A0A0', fontWeight: '600' },
  form: { gap: 20 },
  inputContainer: { gap: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#000', marginLeft: 4 },
  input: { backgroundColor: '#FFF', height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, fontWeight: '600', color: '#000' },
  footer: { marginTop: 40, alignItems: 'center', gap: 20 },
  switchBtn: { padding: 10 },
  switchText: { color: '#A0A0A0', fontSize: 14, fontWeight: '600' }
});