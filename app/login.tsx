import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../src/components/atoms/Typography";
import { InputGroup } from "../src/components/molecules/InputGroup";
import { Button } from "../src/components/atoms/Button";
import { AuthContext } from "../src/contexts/AuthContext";
import { ThemeContext } from "../src/contexts/ThemeContext";
import { useRouter } from "expo-router";
import { api } from "../src/services/api";
import { maskCPF, unmask } from "../src/utils/formatters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZelaLogo } from "../src/components/atoms/ZelaLogo";

export default function LoginScreen() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    if (!cpf || !senha) return Alert.alert("Erro", "Preencha todos os campos.");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        cpf: unmask(cpf),
        senha,
      });
      await signIn(response.data.token);
    } catch (e) {
      Alert.alert("Erro", "Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.bg }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <View style={[styles.content, { backgroundColor: theme.bg }]}>
          <View style={styles.header}>
            <ZelaLogo size={60} color={theme.primary} />
            <Typography variant="h1">Zela Severiano</Typography>
            <Typography variant="caption">Zeladoria Urbana</Typography>
          </View>
          <InputGroup
            label="CPF"
            placeholder="000.000.000-00"
            keyboardType="numeric"
            value={cpf}
            onChangeText={(text) => setCpf(maskCPF(text))}
            maxLength={14}
          />
          <InputGroup
            label="Senha"
            placeholder="Sua senha de acesso"
            isPassword
            value={senha}
            onChangeText={setSenha}
          />
        </View>
        <View style={[styles.footer, { backgroundColor: theme.bg }]}>
          <Button
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={{ marginBottom: 16 }}
          />
          <Button
            title="Criar nova conta"
            variant="secondary"
            onPress={() => router.push("/register")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 32 },
  footer: { padding: 24 },
});
