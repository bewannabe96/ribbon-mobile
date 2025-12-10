import { Text, StyleSheet } from "react-native";
import { Color, Sizing } from "@/constants/theme";
import {
  CONTAINER_PADDING_VERTICAL,
  TITLE_PADDING_VERTICAL,
} from "@/components/ui/section/sizing";

type SectionTitleProps = {
  title: string;
};

export default function SectionTitle(props: SectionTitleProps) {
  return <Text style={styles.container}>{props.title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingTop: TITLE_PADDING_VERTICAL - CONTAINER_PADDING_VERTICAL,
    paddingBottom: TITLE_PADDING_VERTICAL,
    color: Color.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
