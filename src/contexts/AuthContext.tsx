import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { api } from "../services/api";
import { useRouter } from "expo-router";

export interface UserProfile {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
}

interface AuthContextProps {
  signed: boolean;
  user: UserProfile | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const token = await SecureStore.getItemAsync("userToken");
        if (token) {
          api.defaults.headers.Authorization = `Bearer ${token}`;
          await fetchProfile();
        }
      } catch (e) {
        console.warn("Erro ao carregar sessão", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/perfis/me");
      setUser(response.data);
    } catch (error) {
      await logout();
    }
  };

  const signIn = async (token: string) => {
    await SecureStore.setItemAsync("userToken", token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    await fetchProfile();
    router.replace("/(tabs)/home");
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUser(null);
    api.defaults.headers.Authorization = undefined;
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, logout, fetchProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
