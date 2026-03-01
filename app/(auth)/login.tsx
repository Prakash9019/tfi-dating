import { router } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "../../components/PrimaryButton";
import { loginUser } from "../../services/api";
import { saveToken } from "../../services/authStorage";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please fill all fields");
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.success) {
        await saveToken(data.token);
        // In a real app, save data.token to SecureStore here
        router.replace("/(fandom)/bias" as any);
      }
    } catch (error: any) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue to your profile</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="surya@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Log In"
          onPress={handleLogin}
          loading={loading}
          style={{ width: "100%" }}
        />

        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => router.push("/(auth)/signup" as any)}
        >
          <Text style={styles.switchText}>
            Don't have an account?{" "}
            <Text style={{ fontWeight: "bold", color: "#000" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1ECE6",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: { alignItems: "center", marginBottom: 40 },
  emoji: { fontSize: 48, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "900", color: "#000", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#A0A0A0", fontWeight: "600" },
  form: { gap: 20 },
  inputContainer: { gap: 8 },
  label: { fontSize: 12, fontWeight: "700", color: "#000", marginLeft: 4 },
  input: {
    backgroundColor: "#FFF",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  footer: { marginTop: 40, alignItems: "center", gap: 20 },
  switchBtn: { padding: 10 },
  switchText: { color: "#A0A0A0", fontSize: 14, fontWeight: "600" },
});
