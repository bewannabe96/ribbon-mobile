import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Color, SizingScale } from "@/constants/theme";
import RecommendHeader from "./components/recommend-header";
import EventSection from "./components/event-section";
import { useScreenEffect } from "@/views/recommend/context/use-screen-effect";
import { useRecommendScreenView } from "@/views/recommend/context/use-recommend-screen-view";

export default function RecommendScreenView() {
  useScreenEffect();

  const { customEvents, ongoingEvents, newEvents, isLoading } =
    useRecommendScreenView();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <RecommendHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RecommendHeader />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EventSection
          title={`${"hello"}님을 위한 맞춤 프로그램`}
          events={customEvents}
        />
        <EventSection title="진행 중인 행사 및 축제" events={ongoingEvents} />
        <EventSection title="새로 등록된 프로그램" events={newEvents} />
      </ScrollView>
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingVertical: SizingScale[6],
  },
});
