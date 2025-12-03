import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";
import { StaticColor } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: StaticColor.indigo600,
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
          title: "내 정보",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 22,
                backgroundColor: color ?? StaticColor.indigo600,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
