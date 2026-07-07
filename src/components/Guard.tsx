import React, { useContext } from "react";
import { Redirect } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { ThemeContext } from "../contexts/ThemeContext";

export const Guard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { signed, loading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.bg,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!signed) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
};
