import React, { useContext, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { InputGroup } from "../../src/components/molecules/InputGroup";
import { Button } from "../../src/components/atoms/Button";
import { Typography } from "../../src/components/atoms/Typography";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { RegisterContext } from "../../src/contexts/RegisterContext";
import { useRouter } from "expo-router";
import { api } from "../../src/services/api";
import { unmask } from "../../src/utils/formatters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterAddress() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { formData, setFormData } = useContext(RegisterContext);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const handleRegister = async () => {
    let newErrors: any = {};
    if (!formData.logradouro) newErrors.logradouro = "Obrigatório.";
    if (!formData.numero) newErrors.numero = "Obrigatório.";
    if (!formData.bairro) newErrors.bairro = "Obrigatório.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = { ...formData, cpf: unmask(formData.cpf) };
      await api.post("/cidadaos/res", payload);
      router.replace("/register/success");
    } catch (e: any) {
      Alert.alert("Erro", e.response?.data?.message || "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.bg }}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: -100 })}
    >
      <View
        style={[
          styles.header,
          { backgroundColor: theme.bg, paddingTop: insets.top + 20 },
        ]}
      >
        <TouchableOpacity
          style={[styles.backButton, { borderColor: theme.border }]}
          onPress={() => router.back()}
        >
          <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Typography variant="h2" style={styles.title}>
          Endereço (2/2)
        </Typography>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <InputGroup
          label="Logradouro"
          placeholder="Ex: Rua Principal"
          value={formData.logradouro}
          onChangeText={(t) => setFormData({ ...formData, logradouro: t })}
          error={errors.logradouro}
        />
        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <InputGroup
              label="Número"
              placeholder="Ex: 123"
              value={formData.numero}
              onChangeText={(t) => setFormData({ ...formData, numero: t })}
              error={errors.numero}
            />
          </View>
          <View style={{ flex: 1 }}>
            <InputGroup
              label="Complemento"
              required={false}
              placeholder="Casa, Ap..."
              value={formData.complemento}
              onChangeText={(t) => setFormData({ ...formData, complemento: t })}
            />
          </View>
        </View>
        <InputGroup
          label="Bairro"
          placeholder="Ex: Centro"
          value={formData.bairro}
          onChangeText={(t) => setFormData({ ...formData, bairro: t })}
          error={errors.bairro}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom || 24, backgroundColor: theme.bg },
        ]}
      >
        <Button
          title="Concluir Cadastro"
          onPress={handleRegister}
          loading={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  title: { flex: 1, textAlign: "center", marginRight: 48 },
  footer: { paddingHorizontal: 24, paddingTop: 16 },
});
