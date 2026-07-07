import React, { useState, useRef, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../src/components/atoms/Typography";
import { Button } from "../src/components/atoms/Button";
import { ThemeContext } from "../src/contexts/ThemeContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CameraScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const insets = useSafeAreaInsets();
  const { categoriaId } = useLocalSearchParams();
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", padding: 24, backgroundColor: theme.bg },
        ]}
      >
        <Typography
          variant="body"
          style={{ textAlign: "center", marginBottom: 16 }}
        >
          Precisamos de acesso à câmera
        </Typography>
        <Button title="Conceder Permissão" onPress={requestPermission} />
      </View>
    );
  }

  const takePic = async () => {
    if (cameraRef.current) {
      const pic = await cameraRef.current.takePictureAsync({ base64: false });
      if (pic) setPhoto(pic.uri);
    }
  };

  const advance = () =>
    router.push({
      pathname: "/submit",
      params: { categoriaId, photoUri: photo || "" },
    });

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
          Evidência
        </Typography>
      </View>

      <View style={styles.content}>
        <Typography variant="body" style={{ marginBottom: 16 }}>
          Tire uma foto clara do problema.
        </Typography>
        <View style={styles.viewfinder}>
          {!photo ? (
            <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />
          ) : (
            <Image source={{ uri: photo }} style={{ flex: 1 }} />
          )}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 24 }]}>
        {!photo ? (
          <>
            <TouchableOpacity
              style={[styles.captureBtn, { borderColor: theme.primary }]}
              onPress={takePic}
            />
            <Button
              title="Pular esta etapa"
              variant="secondary"
              onPress={advance}
              style={({ pressed }) => [
                { borderWidth: 0, marginTop: 16 },
                pressed && { backgroundColor: theme.navBg },
              ]}
            />
          </>
        ) : (
          <>
            <Button
              title="Confirmar Foto"
              onPress={advance}
              style={{ marginBottom: 12, width: "100%" }}
            />
            <Button
              title="Tirar outra"
              variant="secondary"
              onPress={() => setPhoto(null)}
              style={{ width: "100%" }}
            />
          </>
        )}
      </View>
    </View>
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
  content: { flex: 1, padding: 24 },
  viewfinder: {
    flex: 1,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  footer: { padding: 24, alignItems: "center" },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#fff",
    borderWidth: 4,
  },
});
