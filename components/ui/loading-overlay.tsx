import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";
import { useLoadingStore } from "@/store/loading";
import { StaticColor, ColorOpacity } from "@/constants/theme";

export default function LoadingOverlay() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <Modal
      visible={isLoading}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="small" color={StaticColor.indigo600} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: `${StaticColor.gray950}${ColorOpacity[50]}`,
    justifyContent: "center",
    alignItems: "center",
  },
});
