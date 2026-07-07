import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../../src/components/atoms/Typography";
import { Badge } from "../../src/components/atoms/Badge";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../../src/services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReportDetails() {
  const router = useRouter();
  const { theme, isDark } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [address, setAddress] = useState<string>("Carregando endereço...");

  useEffect(() => {
    api
      .get(`/relatos/${id}`)
      .then((res) => {
        setData(res.data);
        reverseGeocode(res.data.latitude, res.data.longitude);
      })
      .catch(console.error);
  }, [id]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const reverse = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      if (reverse.length > 0) {
        const place = reverse[0];
        const street = place.street || place.name || "Rua Desconhecida";
        const number = place.streetNumber ? `, ${place.streetNumber}` : ", S/N";
        const neighborhood =
          place.district || place.subregion || "Bairro não identificado";
        const city = place.city || place.region || "Dr. Severiano";

        setAddress(`${street}${number}\n${neighborhood} - ${city}`);
      } else {
        setAddress("Endereço não localizado");
      }
    } catch (e) {
      setAddress("Falha ao obter endereço exato");
    }
  };

  if (!data)
    return (
      <View style={[styles.center, { backgroundColor: theme.bg }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );

  // Fallback que funciona com Image do React Native perfeitamente
  const placeholderImg = isDark
    ? "https://placehold.co/412x300/334155/94a3b8.png?text=Sem+Foto"
    : "https://placehold.co/412x300/94a3b8/ffffff.png?text=Sem+Foto";

  const hasPhoto = data.urlFoto && data.urlFoto.trim() !== "";

  return (
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
          <FontAwesome6 name="arrow-left" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Typography
          variant="h2"
          style={{ flex: 1, textAlign: "center", marginRight: 48 }}
        >
          Detalhes
        </Typography>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: hasPhoto ? data.urlFoto : placeholderImg }}
          style={[styles.image, { backgroundColor: theme.border }]}
        />

        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <View style={[styles.rowBetween, { borderColor: theme.border }]}>
            <View>
              <Typography variant="label">Status</Typography>
              <Badge status={data.status} />
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Typography variant="label">Data</Typography>
              <Typography
                variant="body"
                style={{ fontWeight: "bold", color: theme.textPrimary }}
              >
                {new Date(data.criadoEm).toLocaleDateString("pt-BR")}
              </Typography>
            </View>
          </View>

          <View style={styles.row}>
            <Typography variant="label">Categoria</Typography>
            <Typography
              variant="body"
              style={{ fontWeight: "bold", color: theme.textPrimary }}
            >
              {data.categoriaNome}
            </Typography>
          </View>

          <View style={styles.row}>
            <Typography variant="label">Endereço Aproximado (GPS)</Typography>
            <Typography
              variant="body"
              style={{ fontWeight: "bold", color: theme.textPrimary }}
            >
              {address}
            </Typography>
          </View>

          {data.descricao && (
            <View style={styles.row}>
              <Typography variant="label">Descrição do Usuário</Typography>
              <Typography variant="body">{data.descricao}</Typography>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", padding: 24 },
  btnIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  content: { padding: 24, paddingBottom: 60 },
  image: { width: "100%", height: 240, borderRadius: 22, marginBottom: 24 },
  card: { padding: 22, borderRadius: 22, borderWidth: 1 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginBottom: 16,
  },
  row: { marginBottom: 16 },
});
