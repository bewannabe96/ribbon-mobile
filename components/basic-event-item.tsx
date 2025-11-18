import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, View } from "react-native";

type BasicEventItemProps = {};

export default function BasicEventItem(props: BasicEventItemProps) {
  const themeText = useThemeColor({}, "text");
  const themeTint = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, { borderColor: themeTint }]}>
      <Text style={[styles.originalTitleText, { color: themeText }]}>
        헤드-원데이 클래스(크리스마스트리 12월4일)
      </Text>
      <Text style={[styles.titleText, { color: themeText }]}>
        크리스마스 트리 원데이 클래스
      </Text>
      <Text style={[styles.descText, { color: themeText, fontWeight: "bold" }]}>
        강남구 시니어 복지관 / 30,000원
      </Text>
      <Text style={[styles.subtitleText, { color: themeText }]}>신청기간</Text>
      <Text style={[styles.descText, { color: themeText }]}>
        24.08.01 (09:00) ~ 24.09.30 (18:00)
      </Text>
      <Text style={[styles.subtitleText, { color: themeText }]}>교육기간</Text>
      <Text style={[styles.descText, { color: themeText, marginBottom: 0 }]}>
        24.10.01 ~ 24.10.01
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },

  originalTitleText: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 2,
  },

  titleText: {
    fontSize: 24,
    marginBottom: 14,
  },

  descText: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 18,
  },

  subtitleText: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: "bold",
    marginBottom: 2,
  },
});
