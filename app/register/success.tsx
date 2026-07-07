import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../../src/components/atoms/Typography";
import { Button } from "../../src/components/atoms/Button";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function RegisterSuccess() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.content}>
        <View style={[styles.circle, { backgroundColor: theme.primaryLight }]}>
          <FontAwesome6 name="user-check" size={44} color={theme.primary} />
        </View>
        <Typography
          variant="h1"
          style={{ color: theme.primary, marginBottom: 8 }}
        >
          Tudo certo!
        </Typography>
        <Typography
          variant="body"
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          As informações foram processadas com sucesso. Continue para acessar o
          sistema.
        </Typography>
      </View>
      <View style={styles.footer}>
        <Button
          title="Ir para o Login"
          onPress={() => router.replace("/login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  footer: { padding: 24 },
});
