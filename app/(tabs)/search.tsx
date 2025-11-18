import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sizing } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BasicEventItem from "@/components/basic-event-item";

type DropdownProps = {
  title: string;
  isSelected?: boolean;
};

function Dropdown(props: DropdownProps) {
  const themeTint = useThemeColor({}, "tint");
  const themeBackground = useThemeColor({}, "background");

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        dropdownStyles.container,
        props.isSelected
          ? { borderColor: themeTint, backgroundColor: themeTint }
          : { borderColor: themeTint, backgroundColor: "transparent" },
      ]}
    >
      <Text
        style={[
          dropdownStyles.text,
          props.isSelected ? { color: themeBackground } : { color: themeTint },
        ]}
      >
        {props.title}
      </Text>
      <MaterialCommunityIcons
        name="chevron-down"
        color={props.isSelected ? themeBackground : themeTint}
        size={18}
      />
    </TouchableOpacity>
  );
}

const dropdownStyles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    alignItems: "center",
    paddingStart: 16,
    paddingEnd: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    gap: 4,
  },

  text: {
    fontSize: 16,
  },
});

export default function SearchScreen() {
  const themeText = useThemeColor({}, "text");
  const themeBackground = useThemeColor({}, "background");

  return (
    <View style={[styles.container, { backgroundColor: themeBackground }]}>
      <SafeAreaView edges={["top"]}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filterScrollViewContent}
          showsHorizontalScrollIndicator={false}
        >
          <Dropdown title="카테고리" />
          <Dropdown title="지역" />
          <Dropdown title="비용" isSelected />
          <Dropdown title="테마" />
          <Dropdown title="신청/모집" />
          <Dropdown title="대상" />
        </ScrollView>
      </SafeAreaView>
      <FlatList
        ListHeaderComponent={
          <Text style={[styles.resultSummaryText, { color: themeText }]}>
            총 28개의 프로그램을 찾았어요
          </Text>
        }
        contentContainerStyle={styles.flatListContainer}
        data={Array.from({ length: 20 })}
        renderItem={() => <BasicEventItem />}
        ItemSeparatorComponent={() => <View style={styles.separatorView} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  filterScrollViewContent: {
    paddingHorizontal: Sizing.horizontalScreenPadding,
    paddingVertical: 20,
    minWidth: "100%",
    gap: 16,
  },

  separator: {
    height: 0.3,
  },

  resultSummaryText: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 24,
  },

  flatListContainer: {
    paddingHorizontal: Sizing.horizontalScreenPadding,
    paddingVertical: 20,
  },

  separatorView: {
    height: 24,
  },
});
