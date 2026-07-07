import { Slot } from "expo-router";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider, ThemeContext } from "../src/contexts/ThemeContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";

function RootApp() {
  const { isDark } = useContext(ThemeContext);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} translucent={true} />
      <Slot />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <RootApp />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
