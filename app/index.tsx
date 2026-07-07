import { Redirect } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../src/contexts/AuthContext";
import { ThemeContext } from "../src/contexts/ThemeContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { signed, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", backgroundColor: theme.bg }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return signed ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />;
}
