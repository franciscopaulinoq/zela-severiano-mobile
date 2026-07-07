import React, { useContext } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { Typography } from "../atoms/Typography";
import { Badge } from "../atoms/Badge";
import { ThemeContext } from "../../contexts/ThemeContext";

export interface ReportData {
  id: number;
  categoriaNome: string;
  categoriaIconeNome: string;
  status: string;
  criadoEm: string;
}

interface ReportCardProps {
  data: ReportData;
  onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ data, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const dateStr = new Date(data.criadoEm).toLocaleDateString("pt-BR");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: pressed ? theme.primaryLight : theme.surface,
          borderColor: theme.border,
        },
        { transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.primaryLight }]}>
        <FontAwesome6
          name={data.categoriaIconeNome || "map-pin"}
          size={24}
          color={theme.primary}
        />
      </View>
      <View style={styles.infoBox}>
        <Typography variant="h2" style={{ fontSize: 15, marginBottom: 4 }}>
          {data.categoriaNome}
        </Typography>
        <Typography variant="body" style={{ fontSize: 13, marginBottom: 8 }}>
          <FontAwesome6 name="calendar-days" /> {dateStr}
        </Typography>
        <Badge status={data.status} />
      </View>
      <FontAwesome6 name="chevron-right" size={16} color={theme.border} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 52,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoBox: { flex: 1 },
});
