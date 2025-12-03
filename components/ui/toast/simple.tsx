import { View, Text, StyleSheet } from "react-native";
import { SizingScale, StaticColor } from "@/constants/theme";

export default function SimpleToast(props: any) {
  return (
    <View style={styles.customToast}>
      <Text style={styles.titleText}>{props.text1}</Text>
      {props.text2 && <Text style={styles.bodyText}>{props.text2}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  customToast: {
    backgroundColor: StaticColor.gray600,
    paddingHorizontal: SizingScale[4],
    paddingVertical: SizingScale[2.5],
    borderRadius: 6,

    shadowColor: StaticColor.gray500,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },

  titleText: {
    fontSize: 14,
    color: "#ffffff",
    fontFamily: "Pretendard",
  },

  bodyText: {
    color: "#ffffff",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Pretendard",
  },
});
