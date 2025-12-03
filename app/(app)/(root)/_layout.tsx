import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { SizingScale, StaticColor } from "@/constants/theme";
import { Search, ThumbsUp, User } from "lucide-react-native";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: StaticColor.indigo600,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "추천",
          tabBarIcon: ({ color }) => (
            <ThumbsUp size={SizingScale[4]} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "탐색",
          tabBarIcon: ({ color }) => (
            <Search size={SizingScale[4]} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "내 정보",
          tabBarIcon: ({ color }) => (
            <User size={SizingScale[4]} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
