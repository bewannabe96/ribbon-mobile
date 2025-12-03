import { StyleSheet, View } from "react-native";
import { SEPARATOR_HEIGHT } from "@/components/ui/section/sizing";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SectionSeparator() {
  const surfaceColor = useThemeColor("surface");

  return <View style={[styles.container, { backgroundColor: surfaceColor }]} />;
}

const styles = StyleSheet.create({
  container: {
    height: SEPARATOR_HEIGHT,
  },
});
