import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../src/components/atoms/Typography";
import { Button } from "../src/components/atoms/Button";
import { ThemeContext } from "../src/contexts/ThemeContext";
import { Guard } from "../src/components/Guard";
import { useRouter, useLocalSearchParams } from "expo-router";
import { api } from "../src/services/api";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SubmitScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const { categoriaId, photoUri } = useLocalSearchParams();

  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [address, setAddress] = useState<string>("Buscando endereço...");
  const [descricao, setDescricao] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permissão de GPS negada.");
        return Alert.alert("Erro", "Permissão de GPS negada.");
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (reverse.length > 0) {
          const place = reverse[0];
          const street = place.street || place.name || "Rua Desconhecida";
          const number = place.streetNumber
            ? `, ${place.streetNumber}`
            : ", S/N";
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
    })();
  }, []);

  const handleSubmit = async () => {
    if (!location) return Alert.alert("Aguarde", "Obtendo GPS...");

    setLoading(true);
    try {
      const formData = new FormData();
      const payload = {
        categoriaId: Number(categoriaId),
        descricao,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      formData.append("dados", {
        string: JSON.stringify(payload),
        type: "application/json",
      } as any);

      if (photoUri && typeof photoUri === "string" && photoUri.length > 0) {
        formData.append("foto", {
          uri: photoUri,
          name: "evidencia.jpg",
          type: "image/jpeg",
        } as any);
      }

      await api.post("/relatos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.replace("/success");
    } catch (e: any) {
      Alert.alert(
        "Erro",
        e.response?.data?.message || "Falha ao enviar relato.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Guard>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: theme.bg }}
      >
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
            <FontAwesome6
              name="arrow-left"
              size={20}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
          <Typography
            variant="h2"
            style={{ flex: 1, textAlign: "center", marginRight: 48 }}
          >
            Detalhes Finais
          </Typography>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.mapMockup, { backgroundColor: theme.border }]}>
            {location ? (
              <MapView
                style={{ width: "100%", height: "100%" }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                />
              </MapView>
            ) : (
              <FontAwesome6
                name="map-location-dot"
                size={38}
                color={theme.danger}
              />
            )}

            <View style={styles.gpsBadge}>
              <FontAwesome6 name="crosshairs" color={theme.success} />
              <Typography
                variant="body"
                style={{
                  color: theme.success,
                  fontWeight: "bold",
                  marginLeft: 4,
                }}
              >
                {location ? "GPS Ativo" : "Buscando GPS..."}
              </Typography>
            </View>
          </View>

          <View style={{ marginBottom: 22 }}>
            <Typography variant="label">Endereço Capturado</Typography>
            <TextInput
              style={[
                styles.addressArea,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.bg,
                  color: theme.textSecondary,
                },
              ]}
              editable={false}
              multiline
              value={address}
            />
          </View>

          <View style={{ marginBottom: 22 }}>
            <Typography variant="label">Descrição (Opcional)</Typography>
            <TextInput
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={[
                styles.textArea,
                {
                  borderColor: isFocused ? theme.primary : theme.border,
                  backgroundColor: theme.surface,
                  color: theme.textPrimary,
                },
              ]}
              multiline
              placeholderTextColor={theme.textSecondary}
              placeholder="Ex: Poste apagado em frente ao mercado..."
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>
        </ScrollView>

        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom || 24, backgroundColor: theme.bg },
          ]}
        >
          <Button
            title="Enviar Relato"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </Guard>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", padding: 24 },
  btnIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  content: { padding: 24 },
  mapMockup: {
    height: 220,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  gpsBadge: {
    position: "absolute",
    bottom: 12,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  addressArea: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    minHeight: 70,
    textAlignVertical: "center",
  },
  textArea: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 16,
    minHeight: 110,
    textAlignVertical: "top",
  },
  footer: { paddingHorizontal: 24, paddingTop: 16 },
});
