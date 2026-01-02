import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../services/apiClient";
import { initPurchases } from "../services/subscriptionService";

interface AuthContextType {
  user: any;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: any) => Promise<void>;
  refreshToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: false,
  login: async () => {},
  refreshToken: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    restore();
  }, []);

  const restore = async () => {
    setIsLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setAuthToken(storedToken);

        await initPurchases(
          process.env.EXPO_PUBLIC_REVENUECAT_KEY!,
          JSON.parse(storedUser).id.toString()
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string, userData: any) => {
    setIsLoading(true);
    try {
      setUser(userData);
      setToken(newToken);
      setAuthToken(newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", newToken);

      await initPurchases(
        process.env.EXPO_PUBLIC_REVENUECAT_KEY!,
        String(userData.id)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async (newToken: string) => {
    setToken(newToken);
    setAuthToken(newToken);
    await AsyncStorage.setItem("token", newToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, refreshToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
