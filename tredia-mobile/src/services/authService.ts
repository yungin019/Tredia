// src/services/authService.ts

import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

// ==============================
// API BASE
// ==============================
const API = "http://192.168.1.14:4000/api/auth";

// ==============================
// GOOGLE CLIENT ID (Google Cloud → OAuth 2.0 client)
// ==============================
// Mets ici exactement l’ID client que tu as copié sur Google Cloud
// Exemple : "676892933166-oqfmgmud1d6p2d7regmt0p4ugunv4nss.apps.googleusercontent.com"
const GOOGLE_WEB_CLIENT_ID =
  "676892933166-oqfmgmud1d6p2d7regmt0p4ugunv4nss.apps.googleusercontent.com";

// ==============================
// HELPERS
// ==============================
async function saveToken(token: string) {
  await SecureStore.setItemAsync("tredia_token", token);
}

export async function getStoredToken() {
  return SecureStore.getItemAsync("tredia_token");
}

export async function logout() {
  await SecureStore.deleteItemAsync("tredia_token");
}

// ==============================
// EMAIL REGISTER
// ==============================
export async function registerWithEmail(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const res = await axios.post(`${API}/email/register`, { email, password });
    await saveToken(res.data.token);
    return true;
  } catch (err) {
    console.log("EMAIL REGISTER ERROR:", err);
    return false;
  }
}

// ==============================
// EMAIL LOGIN
// ==============================
export async function loginWithEmail(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const res = await axios.post(`${API}/email/login`, { email, password });
    await saveToken(res.data.token);
    return true;
  } catch (err) {
    console.log("EMAIL LOGIN ERROR:", err);
    return false;
  }
}

// ==============================
// GOOGLE LOGIN (Expo AuthSession)
// ==============================

type GoogleAuthResult = AuthSession.AuthSessionResult & {
  params?: { id_token?: string };
};

export async function loginWithGoogle(): Promise<boolean> {
  try {
    // redirect URI basé sur le scheme défini dans app.json ("tredia")
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: "tredia",
    });

    const authUrl =
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${GOOGLE_WEB_CLIENT_ID}` +
      "&response_type=id_token" +
      "&scope=openid%20email%20profile" +
      `&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // ⚠️ Hack TS : cast en any pour utiliser startAsync
    const result = (await (AuthSession as any).startAsync({
      authUrl,
      returnUrl: redirectUri,
    })) as GoogleAuthResult;

    if (result.type !== "success") {
      console.log("Google login cancelled");
      return false;
    }

    const idToken = result.params?.id_token;
    if (!idToken) {
      console.log("No id_token returned from Google");
      return false;
    }

    const res = await axios.post(`${API}/google`, { idToken });
    await saveToken(res.data.token);

    return true;
  } catch (err) {
    console.log("GOOGLE LOGIN ERROR:", err);
    return false;
  }
}

// ==============================
// APPLE LOGIN
// ==============================
export async function loginWithApple(): Promise<boolean> {
  try {
    const response = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    const identityToken = response.identityToken;
    if (!identityToken) {
      console.log("No identityToken returned from Apple");
      return false;
    }

    const res = await axios.post(`${API}/apple`, {
      identityToken,
    });

    await saveToken(res.data.token);
    return true;
  } catch (err: any) {
    if (err?.code === "ERR_CANCELED") {
      console.log("Apple login cancelled");
      return false;
    }
    console.log("APPLE LOGIN ERROR:", err);
    return false;
  }
}
