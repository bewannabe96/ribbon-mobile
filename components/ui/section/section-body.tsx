import { PropsWithChildren } from "react";
import { View, StyleSheet } from "react-native";
import { Sizing } from "@/constants/theme";

export default function SectionBody(props: PropsWithChildren) {
  return <View style={styles.container}>{props.children}</View>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.screenPaddingX,
  },
});
