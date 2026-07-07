import React, { useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Typography } from "../atoms/Typography";
import { Input } from "../atoms/Input";
import { TextInputProps } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";

interface InputGroupProps extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
  isPassword?: boolean;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  style,
  error,
  required = true,
  isPassword,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Typography variant="label">
        {label} {required && <Text style={{ color: theme.danger }}>*</Text>}
      </Typography>
      <Input
        {...props}
        style={[style, error ? { borderColor: theme.danger } : {}]}
        isPassword={isPassword}
      />
      {error && (
        <Typography
          variant="body"
          style={{ color: theme.danger, fontSize: 12, marginTop: 4 }}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 22, width: "100%" },
});
