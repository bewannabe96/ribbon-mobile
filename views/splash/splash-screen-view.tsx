import { View, StyleSheet, Text } from "react-native";
import React from "react";
import { Color, StaticColor } from "@/constants/theme";

export default function SplashScreenView() {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>리본</Text>
      <Text style={styles.sloganText}>인생의 모든 순간을 즐겁게</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontFamily: "Jalnan2",
    fontSize: 84,
    color: StaticColor.indigo600,
  },

  sloganText: {
    fontFamily: "Pretendard",
    fontWeight: "bold",
    fontSize: 16,
    color: Color.text,
  },
});
