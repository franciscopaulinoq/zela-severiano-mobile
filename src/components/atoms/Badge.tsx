import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  const { theme } = useContext(ThemeContext);
  const isPendente = status === "PENDENTE";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isPendente ? "#ffedd5" : "#dcfce7" },
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: isPendente ? theme.warning : theme.success },
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  text: { fontSize: 13, fontWeight: "700" },
});
