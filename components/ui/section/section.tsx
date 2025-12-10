import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { CONTAINER_PADDING_VERTICAL } from "@/components/ui/section/sizing";
import { Color, SizingScale } from "@/constants/theme";

export default function Section(props: PropsWithChildren) {
  return <View style={styles.container}>{props.children}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SizingScale[4],
    borderWidth: 1,
    borderColor: Color.border,
    paddingVertical: CONTAINER_PADDING_VERTICAL,
    backgroundColor: Color.background,
  },
});
