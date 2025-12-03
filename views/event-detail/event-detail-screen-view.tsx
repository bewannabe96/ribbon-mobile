import { View, StyleSheet } from "react-native";
import { Color } from "@/constants/theme";
import { EventDetailHeader } from "./components/event-detail-header";
import { EventDetailScrollContent } from "./components/event-detail-scroll-content";
import { EventDetailBottomBar } from "./components/event-detail-bottom-bar";
import { useScreenEffect } from "@/views/event-detail/context/use-screen-effect";

export function EventDetailScreenView() {
  useScreenEffect();

  return (
    <View style={styles.container}>
      <EventDetailHeader />
      <EventDetailScrollContent />
      <EventDetailBottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.surface,
  },
});
