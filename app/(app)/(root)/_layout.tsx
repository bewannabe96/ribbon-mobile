import React, { forwardRef } from "react";
import { TabList, TabSlot, TabTrigger, Tabs } from "expo-router/ui";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Haptics from "expo-haptics";

import { SizingScale, StaticColor } from "@/constants/theme";
import { Search, ThumbsUp, User } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabButtonProps = {
  isFocused?: boolean;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
} & React.ComponentProps<typeof TouchableOpacity>;

const TabButton = forwardRef<View, TabButtonProps>((props, ref) => {
  const handlePress = React.useCallback(
    (e: any) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).then();
      props.onPress?.(e);
    },
    [props],
  );

  return (
    <TouchableOpacity
      ref={ref}
      {...props}
      onPress={handlePress}
      activeOpacity={0.6}
      style={[styles.tabButton, props.isFocused && styles.tabButtonActive]}
    >
      <props.icon
        size={SizingScale[5]}
        color={props.isFocused ? StaticColor.indigo600 : StaticColor.gray500}
      />
      <Text
        style={[
          styles.tabLabel,
          props.isFocused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {props.label}
      </Text>
    </TouchableOpacity>
  );
});

TabButton.displayName = "TabButton";

export default function RootLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <SafeAreaView style={styles.tabBar} edges={["bottom"]}>
          <TabTrigger name="index" href="/" asChild>
            <TabButton label="추천" icon={ThumbsUp} />
          </TabTrigger>
          <TabTrigger name="search" href="/search" asChild>
            <TabButton label="탐색" icon={Search} />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabButton label="내 정보" icon={User} />
          </TabTrigger>
        </SafeAreaView>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: StaticColor.gray200,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SizingScale[2],
  },

  tabButtonActive: {
    backgroundColor: "transparent",
  },

  tabLabel: {
    fontSize: 12,
    fontFamily: "Pretendard",
    fontWeight: 400,
  },

  tabLabelActive: {
    color: StaticColor.indigo600,
  },

  tabLabelInactive: {
    color: StaticColor.gray500,
  },
});
