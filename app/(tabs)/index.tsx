import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sizing } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useCallback, useMemo, useState } from "react";
import BasicEventItem from "@/components/basic-event-item";
import { router } from "expo-router";

type SectionProps = {
  title: string;
  itemCount: number;
};

function Section(props: SectionProps) {
  const themeText = useThemeColor({}, "text");
  const themeTint = useThemeColor({}, "tint");
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemWidth = useMemo(
    () => width - Sizing.horizontalScreenPadding * 2 - 40,
    [width],
  );

  const snapInterval = useMemo(
    () => itemWidth + Sizing.horizontalScreenPadding,
    [itemWidth],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / snapInterval);
      setCurrentIndex(index);
    },
    [snapInterval],
  );

  return (
    <View>
      <Text style={[sectionStyles.titleText, { color: themeText }]}>
        {props.title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={sectionStyles.carouselView}
        contentContainerStyle={{
          paddingHorizontal: Sizing.horizontalScreenPadding,
          gap: Sizing.horizontalScreenPadding,
        }}
      >
        {Array.from({ length: props.itemCount }).map((_, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.6}
            onPress={() => router.push("/event-detail")}
            style={{ width: itemWidth }}
          >
            <BasicEventItem />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={[sectionStyles.indicatorText, { color: themeTint }]}>
        {currentIndex + 1} / {props.itemCount}
      </Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  titleText: {
    paddingHorizontal: Sizing.horizontalScreenPadding + 6,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  carouselView: {
    marginBottom: 6,
  },

  indicatorText: {
    paddingHorizontal: Sizing.horizontalScreenPadding + 6,
    fontSize: 12,
    opacity: 0.6,
    fontWeight: "bold",
  },
});

export default function RecommendScreen() {
  const themeBackground = useThemeColor({}, "background");
  const themeText = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor: themeBackground }]}>
      <SafeAreaView
        style={[styles.navigationBar, { backgroundColor: themeBackground }]}
        edges={["top"]}
      >
        <Text style={[styles.logoText, { color: themeText }]}>OSSO</Text>
      </SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Section title="{닉네임}을 위한 맞춤 프로그램" itemCount={3} />
        <Section title="진행 중인 행사 및 축제" itemCount={4} />
        <Section title="새로 등록된 프로그램" itemCount={2} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navigationBar: {
    paddingHorizontal: Sizing.horizontalScreenPadding,
    paddingVertical: 36,
  },

  logoText: {
    fontSize: 18,
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    paddingTop: 20,
    paddingBottom: 56,
    gap: 50,
  },
});
