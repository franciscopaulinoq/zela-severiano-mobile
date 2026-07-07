import React, { useEffect, useContext, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../src/components/atoms/Typography";
import { Button } from "../src/components/atoms/Button";
import { ThemeContext } from "../src/contexts/ThemeContext";
import { useRouter } from "expo-router";

export default function SuccessScreen() {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => router.replace("/(tabs)/home"), 3000);
    return () => clearTimeout(timer);
  }, []);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.content}>
        <View style={[styles.circle, { backgroundColor: "#dcfce7" }]}>
          <FontAwesome6 name="check" size={46} color={theme.success} />
        </View>
        <Typography
          variant="h1"
          style={{ color: theme.success, marginBottom: 8 }}
        >
          Relato Enviado!
        </Typography>
        <Typography
          variant="body"
          style={{ textAlign: "center", marginBottom: 32 }}
        >
          Agradecemos por colaborar com Doutor Severiano. A prefeitura já
          recebeu seu chamado.
        </Typography>

        <Typography variant="caption" style={{ marginBottom: 8 }}>
          Redirecionando automaticamente...
        </Typography>
        <View
          style={[styles.progressContainer, { backgroundColor: theme.border }]}
        >
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: theme.primary, width: widthInterpolated },
            ]}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Ir para o Início agora"
          variant="secondary"
          onPress={() => router.replace("/(tabs)/home")}
          style={{ borderWidth: 0 }}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    elevation: 5,
    shadowOpacity: 0.2,
  },
  progressContainer: {
    width: "100%",
    height: 6,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
  },
  progressBar: { height: "100%", borderRadius: 4 },
  footer: { padding: 24 },
});
