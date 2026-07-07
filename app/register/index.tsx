import React, { useState, useContext } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { InputGroup } from "../../src/components/molecules/InputGroup";
import { Button } from "../../src/components/atoms/Button";
import { Typography } from "../../src/components/atoms/Typography";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { RegisterContext } from "../../src/contexts/RegisterContext";
import { useRouter } from "expo-router";
import { maskCPF } from "../../src/utils/formatters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegisterStep1() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { formData, setFormData } = useContext(RegisterContext);
  const insets = useSafeAreaInsets();

  const [errors, setErrors] = useState<any>({});

  const handleNext = () => {
    let newErrors: any = {};
    if (!formData.nomeCompleto) newErrors.nomeCompleto = "Nome é obrigatório.";
    if (formData.cpf.replace(/\D/g, "").length !== 11)
      newErrors.cpf = "CPF deve ter 11 dígitos.";
    if (!formData.email.includes("@")) newErrors.email = "E-mail inválido.";
    if (formData.senha.length < 6) newErrors.senha = "Mínimo 6 caracteres.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      router.push("/register/address");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.bg }}
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
          Criar Conta (1/2)
        </Typography>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <Typography variant="body" style={{ marginBottom: 24 }}>
          Preencha seus dados para acessar os serviços da Prefeitura.
        </Typography>

        <InputGroup
          label="Nome Completo"
          placeholder="Maria da Silva"
          value={formData.nomeCompleto}
          onChangeText={(t) => setFormData({ ...formData, nomeCompleto: t })}
          error={errors.nomeCompleto}
        />
        <InputGroup
          label="CPF"
          placeholder="000.000.000-00"
          keyboardType="numeric"
          value={formData.cpf}
          onChangeText={(t) => setFormData({ ...formData, cpf: maskCPF(t) })}
          maxLength={14}
          error={errors.cpf}
        />
        <InputGroup
          label="E-mail"
          placeholder="seu@email.com"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(t) => setFormData({ ...formData, email: t })}
          error={errors.email}
        />
        <InputGroup
          label="Crie uma Senha"
          placeholder="Mínimo 6 caracteres"
          isPassword
          value={formData.senha}
          onChangeText={(t) => setFormData({ ...formData, senha: t })}
          error={errors.senha}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom || 24, backgroundColor: theme.bg },
        ]}
      >
        <Button title="Prosseguir" onPress={handleNext} />
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
