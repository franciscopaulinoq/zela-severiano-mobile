import React, { useState, useContext } from "react";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { ThemeContext } from "../../contexts/ThemeContext";

interface InputProps extends TextInputProps {
  error?: string;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  style,
  error,
  isPassword,
  ...props
}) => {
  const { theme } = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: theme.surface, borderColor: theme.border },
          isFocused && { borderColor: theme.primary },
          error ? { borderColor: theme.danger } : null,
          style,
        ]}
      >
        <TextInput
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, { color: theme.textPrimary }]}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.iconContainer}
          >
            <FontAwesome6
              name={isSecure ? "eye-slash" : "eye"}
              size={18}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  inputContainer: {
    width: "100%",
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  iconContainer: {
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
});
