import React, { useState, useCallback, useContext } from "react";
import { View, FlatList, StyleSheet, Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Typography } from "../../src/components/atoms/Typography";
import {
  ReportCard,
  ReportData,
} from "../../src/components/molecules/ReportCard";
import { api } from "../../src/services/api";
import { AuthContext } from "../../src/contexts/AuthContext";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { useRouter, useFocusEffect } from "expo-router";
import { capitalizeFirstName } from "../../src/utils/formatters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const [relatos, setRelatos] = useState<ReportData[]>([]);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const firstName = capitalizeFirstName(user?.nomeCompleto || "Cidadão");
  const initial = firstName.charAt(0).toUpperCase();

  useFocusEffect(
    useCallback(() => {
      api
        .get("/relatos")
        .then((res) => setRelatos(res.data))
        .catch(console.error);
    }, []),
  );

  // Criamos uma versão transparente da cor de fundo atual para o degradê perfeito
  const transparentBg = theme.bg + "00";

  const tabBarHeight = 64;

  const tabBarBottom = insets.bottom > 0 ? insets.bottom : 16;

  const fabBottom = tabBarBottom + tabBarHeight + 32;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.primary, paddingTop: insets.top + 20 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="h2" style={{ color: "white" }}>
            Olá, {firstName}!
          </Typography>
          <Typography variant="body" style={{ color: theme.primaryLight }}>
            Acompanhe seus relatos
          </Typography>
        </View>
        <View style={[styles.avatar, { backgroundColor: theme.surface }]}>
          <Typography
            variant="h2"
            style={{ color: theme.primary, textAlign: "center" }}
          >
            {initial}
          </Typography>
        </View>
      </View>

      <FlatList
        data={relatos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 24, paddingBottom: 160 }}
        renderItem={({ item }) => (
          <ReportCard
            data={item}
            onPress={() => router.push(`/report/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome6
              name="folder-open"
              size={48}
              color={theme.border}
              style={{ marginBottom: 16 }}
            />
            <Typography variant="body" style={{ textAlign: "center" }}>
              Você ainda não enviou nenhum relato. Clique no + para começar.
            </Typography>
          </View>
        }
      />

      {/* Gradiente Esfumaçado - Vidro */}
      <LinearGradient
        colors={[transparentBg, theme.bg]}
        locations={[0, 0.8]}
        style={styles.fadeBottom}
        pointerEvents="none"
      />

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.primary,
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            bottom: fabBottom,
          },
        ]}
        onPress={() => router.push("/category")}
        accessibilityLabel="Novo Relato"
      >
        <FontAwesome6 name="plus" size={24} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: { alignItems: "center", marginTop: 60 },
  fadeBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 1,
  },
  fab: {
    position: "absolute",
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    zIndex: 3,
  },
});
