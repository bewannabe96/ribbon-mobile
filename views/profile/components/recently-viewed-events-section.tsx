import { Section, SectionBody, SectionTitle } from "@/components/ui/section";
import EventCard from "./event-card";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { SizingScale } from "@/constants/theme";
import { useRecentlyViewedEvents } from "@/views/profile/context/use-recently-viewed-events";
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function RecentlyViewedEventsSection() {
  const { isSignedIn } = useAuth();
  const { recentlyViewedEvents, hasMore, isLoading } =
    useRecentlyViewedEvents();

  const renderBody = useCallback(() => {
    if (!isSignedIn) {
      return (
        <SectionBody>
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>로그인이 필요한 서비스입니다</Text>
          </View>
        </SectionBody>
      );
    }

    if (isLoading) {
      return (
        <SectionBody>
          <View style={styles.emptyView}>
            <ActivityIndicator size="small" />
          </View>
        </SectionBody>
      );
    }

    if (recentlyViewedEvents.length === 0) {
      return (
        <SectionBody>
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>최근에 본 내역이 없습니다</Text>
          </View>
        </SectionBody>
      );
    }

    return (
      <SectionBody>
        {recentlyViewedEvents.map((event, index) => (
          <EventCard
            key={event.uuid}
            {...event}
            isLast={index === recentlyViewedEvents.length - 1}
          />
        ))}
        {hasMore && (
          <View style={styles.buttonView}>
            <Button label="더보기" />
          </View>
        )}
      </SectionBody>
    );
  }, [hasMore, isLoading, isSignedIn, recentlyViewedEvents]);

  return (
    <Section>
      <SectionTitle title="최근 본 프로그램" />
      {renderBody()}
    </Section>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    marginTop: SizingScale[5],
  },

  emptyView: {
    paddingVertical: SizingScale[6],
    alignItems: "center",
    gap: SizingScale[4],
  },

  emptyText: {
    fontSize: 14,
    fontFamily: "Pretendard",
  },
});
