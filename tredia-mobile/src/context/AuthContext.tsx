// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    restore();
  }, []);

  const restore = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      const storedToken = await AsyncStorage.getItem("token");

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        // Re-init RevenueCat with saved user id
        await initPurchases(
          process.env.EXPO_PUBLIC_REVENUECAT_KEY!,
          String(parsedUser.id)
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (newToken: string, userData: any) => {
    try {
      setIsLoading(true);

      setUser(userData);
      setToken(newToken);

      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("token", newToken);

      // RevenueCat init when user logs in / registers
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
    await AsyncStorage.setItem("token", newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        refreshToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
