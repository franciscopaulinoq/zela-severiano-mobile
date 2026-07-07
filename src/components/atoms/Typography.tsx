import React, { useContext } from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";

interface TypographyProps extends TextProps {
  variant?: "h1" | "h2" | "h3" | "body" | "caption" | "label";
}

export const Typography: React.FC<TypographyProps> = ({
  variant = "body",
  style,
  children,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    h1: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.primary,
      marginBottom: 8,
    },
    h2: { fontSize: 20, fontWeight: "700", color: theme.textPrimary },
    h3: { fontSize: 18, fontWeight: "600", color: theme.textPrimary },
    body: { fontSize: 14, color: theme.textSecondary, lineHeight: 21 },
    caption: { fontSize: 14, color: theme.textSecondary },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textPrimary,
      marginBottom: 8,
      marginLeft: 2,
    },
  });

  return (
    <Text style={[styles[variant], style]} {...props}>
      {children}
    </Text>
  );
};
