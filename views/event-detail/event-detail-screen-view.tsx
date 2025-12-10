import { View, StyleSheet, ActivityIndicator } from "react-native";
import { Color } from "@/constants/theme";
import { EventDetailHeader } from "./components/event-detail-header";
import { EventDetailScrollContent } from "./components/event-detail-scroll-content";
import { EventDetailBottomBar } from "./components/event-detail-bottom-bar";
import { useScreenEffect } from "@/views/event-detail/context/use-screen-effect";
import { useEventDetailScreenView } from "@/views/event-detail/context/use-event-detail-screen-view";

export function EventDetailScreenView() {
  const { eventDetail } = useEventDetailScreenView();

  useScreenEffect();

  return (
    <View style={styles.container}>
      <EventDetailHeader />
      {eventDetail === null ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      ) : (
        <>
          <EventDetailScrollContent />
          <EventDetailBottomBar />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.surface,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
