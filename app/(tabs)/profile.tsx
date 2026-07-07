import React, { useContext } from "react";
import { View, StyleSheet, Switch, Platform, Alert } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../../src/components/atoms/Typography";
import { Button } from "../../src/components/atoms/Button";
import { AuthContext } from "../../src/contexts/AuthContext";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { hideCPF, capitalizeFirstName } from "../../src/utils/formatters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();

  const firstName = capitalizeFirstName(user?.nomeCompleto || "U");
  const initial = firstName.charAt(0).toUpperCase();

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja desconectar do Zela Severiano?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: logout,
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <Typography variant="h2">Configurações</Typography>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Typography
              variant="h1"
              style={{ color: "white", fontSize: 42, marginBottom: 0 }}
            >
              {initial}
            </Typography>
          </View>
          <Typography variant="h2">{user?.nomeCompleto}</Typography>
          <Typography variant="body">
            CPF: {hideCPF(user?.cpf || "")}
          </Typography>
        </View>

        <View
          style={[
            styles.settingCard,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <FontAwesome6 name="moon" size={22} color={theme.textSecondary} />
            <Typography variant="label" style={{ marginBottom: 0 }}>
              Modo Escuro
            </Typography>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={
              Platform.OS === "ios" ? "#fff" : isDark ? "#fff" : "#f4f3f4"
            }
          />
        </View>

        <Button
          title="Sair da Conta"
          variant="secondary"
          colorOverride={theme.danger}
          onPress={handleLogout}
          style={{ marginTop: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 24, borderBottomWidth: 1 },
  content: { padding: 24 },
  avatarContainer: { alignItems: "center", marginBottom: 40 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  settingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
  },
});
