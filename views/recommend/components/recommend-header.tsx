import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SizingScale, StaticColor, Sizing, Color } from "@/constants/theme";

export default function RecommendHeader() {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <Text style={styles.logoText}>오소</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.background,
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
    borderBottomWidth: 1,
    borderColor: Color.border,
  },

  logoText: {
    fontFamily: "Black Han Sans",
    fontSize: 40,
    color: StaticColor.indigo600,
  },

  searchButton: {
    padding: SizingScale[1],
  },
});
