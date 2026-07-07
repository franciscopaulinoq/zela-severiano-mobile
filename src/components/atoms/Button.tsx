import React, { useContext } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Pressable,
  PressableProps,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary";
  colorOverride?: string;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  colorOverride,
  loading = false,
  style,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);
  const isPrimary = variant === "primary";

  const mainColor = colorOverride || theme.primary;
  // Aplica 10% de opacidade na cor principal para o efeito de hover/press do botão secundário
  const secondaryHoverBg = colorOverride
    ? `${colorOverride}1A`
    : theme.primaryLight;

  return (
    <Pressable
      disabled={loading || props.disabled}
      style={({ pressed }) => [
        styles.base,
        isPrimary
          ? { backgroundColor: pressed ? theme.primaryHover : mainColor }
          : {
              backgroundColor: pressed ? secondaryHoverBg : "transparent",
              borderColor: mainColor,
              borderWidth: 2,
            },
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? "#fff" : mainColor} />
      ) : (
        <Text
          style={[styles.text, { color: isPrimary ? "#ffffff" : mainColor }]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    minWidth: 48,
    borderRadius: 14,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: { fontSize: 16, fontWeight: "600" },
});
