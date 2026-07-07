import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../src/components/atoms/Typography";
import { ThemeContext } from "../src/contexts/ThemeContext";
import { Guard } from "../src/components/Guard";
import { useRouter } from "expo-router";
import { api } from "../src/services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Categoria {
  id: number;
  nome: string;
  iconeNome: string;
}

export default function CategoryScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch(console.error);
  }, []);

  return (
    <Guard>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <View
          style={[
            styles.header,
            { backgroundColor: theme.surface, paddingTop: insets.top + 20 },
          ]}
        >
          <TouchableOpacity
            style={[styles.btnIcon, { borderColor: theme.border }]}
            onPress={() => router.back()}
          >
            <FontAwesome6 name="xmark" size={20} color={theme.textPrimary} />
          </TouchableOpacity>
          <Typography
            variant="h2"
            style={{ flex: 1, textAlign: "center", marginRight: 48 }}
          >
            Novo Relato
          </Typography>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24 }}>
          <Typography
            variant="h1"
            style={{ fontSize: 22, color: theme.textPrimary }}
          >
            O que aconteceu?
          </Typography>
          <Typography variant="body" style={{ marginBottom: 32 }}>
            Escolha o tipo de problema:
          </Typography>

          <View style={styles.grid}>
            {categorias.map((cat, index) => {
              const isLastOdd =
                categorias.length % 2 !== 0 && index === categorias.length - 1;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() =>
                    router.push({
                      pathname: "/camera",
                      params: { categoriaId: cat.id },
                    })
                  }
                  style={({ pressed }) => [
                    styles.card,
                    isLastOdd && { width: "100%" },
                    {
                      backgroundColor: pressed
                        ? theme.primaryLight
                        : theme.surface,
                      borderColor: pressed ? theme.primary : theme.border,
                    },
                    { transform: [{ scale: pressed ? 0.96 : 1 }] },
                  ]}
                >
                  <FontAwesome6
                    name={cat.iconeNome || "map-pin"}
                    size={38}
                    color={theme.primary}
                  />
                  <Typography
                    variant="label"
                    style={{ textAlign: "center", marginTop: 12 }}
                  >
                    {cat.nome}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </Guard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 24 },
  btnIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    width: "47%",
    borderWidth: 2,
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
