import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "추천",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={22} name="recommend" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "탐색",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={22} name="search" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "프로필",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 22,
                backgroundColor: color ?? Colors[colorScheme ?? "light"].text,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
