// src/screens/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";

import { api, API_BASE_URL } from "../services/api";
import { useAuth } from "../context/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingApple, setLoadingApple] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // ---------------- EMAIL REGISTER ----------------
  const handleRegisterEmail = async () => {
    try {
      setLoadingEmail(true);
      console.log("[EMAIL][REGISTER] POST /auth/register");

      const res = await api.post("/auth/register", {
        email,
        password,
      });

      await login(res.data.token, res.data.user);
      navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
    } catch (err: any) {
      console.log("[EMAIL][REGISTER] ERROR", err?.response?.data || err);
      Alert.alert("Error", err?.response?.data?.error || "Register failed");
    } finally {
      setLoadingEmail(false);
    }
  };

  // ---------------- GOOGLE REGISTER ----------------
  const handleGoogle = async () => {
    try {
      setLoadingGoogle(true);

      const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.log("[GOOGLE][REGISTER] missing client id");
        Alert.alert("Error", "Google client ID is not configured.");
        return;
      }

      const redirectUri = AuthSession.makeRedirectUri();
      console.log("[GOOGLE][REGISTER] redirectUri =", redirectUri);

      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=id_token&scope=openid%20email`;

      console.log("[GOOGLE][REGISTER] authUrl =", authUrl);

      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      console.log("[GOOGLE][REGISTER] result type", result.type);

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const token = url.searchParams.get("id_token");
        if (token) {
          const res = await api.post("/auth/google", { idToken: token });
          await login(res.data.token, res.data.user);
          navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
        }
      }
    } catch (err: any) {
      console.log("[GOOGLE][REGISTER] ERROR", err?.response?.data || err);
    } finally {
      setLoadingGoogle(false);
    }
  };

  // ---------------- APPLE REGISTER ----------------
  const handleApple = async () => {
    try {
      setLoadingApple(true);
      console.log("[API BASE URL][REGISTER]", API_BASE_URL);
      console.log("[APPLE][REGISTER] baseURL =", API_BASE_URL);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential?.identityToken) {
        console.log(
          "[APPLE][REGISTER] POST",
          `${API_BASE_URL}/auth/apple`
        );
        const res = await api.post("/auth/apple", {
          identityToken: credential.identityToken,
        });

        await login(res.data.token, res.data.user);
        navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
      }
    } catch (err: any) {
      console.log("[APPLE][REGISTER] ERROR", err?.response?.data || err);
      Alert.alert("Error", "Apple registration failed");
    } finally {
      setLoadingApple(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#aaa"
          style={styles.input}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.btn}
          disabled={loadingEmail}
          onPress={handleRegisterEmail}
        >
          {loadingEmail ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialBtn}
          disabled={loadingGoogle}
          onPress={handleGoogle}
        >
          <Text style={styles.btnText}>
            {loadingGoogle ? "Loading..." : "Continue with Google"}
          </Text>
        </TouchableOpacity>

        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.CONTINUE
            }
            cornerRadius={5}
            style={styles.appleBtn}
            onPress={handleApple}
          />
        )}

        <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
          <Text style={{ marginTop: 20, color: "#aaa" }}>
            Already have an account? Sign In
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingTop: 100,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    marginBottom: 40,
    color: "#fff",
  },
  input: {
    width: "100%",
    backgroundColor: "#1a1f2e",
    color: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  btn: {
    width: "100%",
    backgroundColor: "#4a90e2",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  socialBtn: {
    width: "100%",
    backgroundColor: "#202636",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  appleBtn: {
    width: "100%",
    height: 44,
    marginTop: 20,
  },
  btnText: {
    color: "#fff",
  },
});

export default RegisterScreen;
