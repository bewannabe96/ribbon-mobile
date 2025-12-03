import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { SizingScale, Sizing, StaticColor } from "@/constants/theme";
import Pill from "@/components/ui/pill";
import { useCallback, useMemo, useState } from "react";
import { RecommendEvent } from "@/views/recommend/context/recommend-screen-context";
import BasicEventItem from "@/components/basic-event-item";

interface EventSectionProps {
  title: string;
  events: RecommendEvent[];
}

export default function EventSection(props: EventSectionProps) {
  // UI
  const { width } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(1);

  const itemWidth = useMemo(() => Math.floor(width * 0.75), [width]);

  const snapInterval = useMemo(() => itemWidth + SizingScale[4], [itemWidth]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const padding = Sizing.screenPaddingX;
      const index = Math.round((offsetX + padding) / snapInterval) + 1;
      setCurrentIndex(Math.min(Math.max(1, index), props.events.length));
    },
    [snapInterval, props.events.length],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleText}>{props.title}</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapInterval}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {props.events.map((event) => (
          <BasicEventItem
            key={event.uuid}
            width={itemWidth}
            uuid={event.uuid}
            name={event.name}
            category={event.category}
            registrationStart={event.registrationStart}
            registrationEnd={event.registrationEnd}
            eventStart={event.eventStart}
            eventEnd={event.eventEnd}
            location={event.location}
            participationFee={event.participationFee}
            registrationStatus={event.registrationStatus}
          />
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        <Pill
          name={`${currentIndex} / ${props.events.length}`}
          variant="outline"
          size="sm"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SizingScale[8],
  },

  header: {
    marginBottom: SizingScale[4],
    paddingHorizontal: Sizing.screenPaddingX,
  },

  titleText: {
    fontSize: 20,
    color: StaticColor.gray900,
    fontWeight: "500",
  },

  scrollView: {
    flexGrow: 0,
  },

  scrollContent: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingBottom: SizingScale[2],
    gap: SizingScale[4],
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SizingScale[3],
  },
});
