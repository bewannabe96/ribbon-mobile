import { View, StyleSheet, Text } from "react-native";
import { SizingScale, StaticColor } from "@/constants/theme";
import type { LucideIcon } from "lucide-react-native";
import React from "react";

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

export function InfoRow({ icon: Icon, label, children }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Icon size={20} color={StaticColor.indigo600} />
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SizingScale[3],
  },

  content: {
    flex: 1,
  },

  label: {
    fontSize: 16,
    color: StaticColor.gray900,
    marginTop: SizingScale[0.5],
    marginBottom: SizingScale[3],
  },
});
