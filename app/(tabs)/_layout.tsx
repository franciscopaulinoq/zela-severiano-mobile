import React, { useContext } from "react";
import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { ThemeContext } from "../../src/contexts/ThemeContext";
import { Typography } from "../../src/components/atoms/Typography";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { theme, isDark } = useContext(ThemeContext);

  return (
    <View style={styles.tabContainer}>
      <BlurView
        intensity={isDark ? 40 : 80}
        tint={isDark ? "dark" : "light"}
        style={styles.blurView}
      >
        <View
          style={[
            styles.tabContent,
            {
              backgroundColor: isDark
                ? "rgba(51, 65, 85, 0.8)"
                : "rgba(226, 232, 240, 0.8)",
            },
          ]}
        >
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const iconName = route.name === "home" ? "house" : "gear";
            const title = options.title;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented)
                navigation.navigate(route.name);
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                style={[
                  styles.tabItem,
                  isFocused && {
                    backgroundColor: theme.navActiveBg,
                    transform: [{ scale: 1.04 }],
                  },
                ]}
              >
                <FontAwesome6
                  name={iconName}
                  size={22}
                  color={
                    isFocused ? theme.navActiveText : theme.navInactiveText
                  }
                />
                <Typography
                  variant="body"
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: isFocused
                      ? theme.navActiveText
                      : theme.navInactiveText,
                    marginTop: 4,
                  }}
                >
                  {title}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" options={{ title: "Início" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    alignItems: "center",
    zIndex: 100,
  },
  blurView: { borderRadius: 28, overflow: "hidden" },
  tabContent: {
    flexDirection: "row",
    padding: 6,
    minWidth: 260,
    justifyContent: "space-between",
    borderRadius: 28,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 22,
    flex: 1,
  },
});
