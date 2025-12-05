import { Section, SectionBody, SectionTitle } from "@/components/ui/section";
import EventCard from "./event-card";
import Button from "@/components/ui/button";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SizingScale } from "@/constants/theme";
import { useFavoriteEvents } from "@/views/profile/context/use-favorite-events";
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function FavoriteEventsSection() {
  const { isSignedIn } = useAuth();
  const { favoriteEvents, hasMore, isLoading } = useFavoriteEvents();

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

    if (favoriteEvents === null || isLoading) {
      return (
        <SectionBody>
          <View style={styles.emptyView}>
            <ActivityIndicator size="small" />
          </View>
        </SectionBody>
      );
    }

    if (favoriteEvents.length === 0) {
      return (
        <SectionBody>
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>찜 목록이 비어 있습니다</Text>
            <Button
              label="프로그램 둘러보기"
              onPress={() => router.push("/search")}
            />
          </View>
        </SectionBody>
      );
    }

    return (
      <SectionBody>
        {favoriteEvents.map((event, index) => (
          <EventCard
            key={event.uuid}
            {...event}
            isLast={index === favoriteEvents.length - 1}
          />
        ))}
        {hasMore && (
          <View style={styles.buttonView}>
            <Button
              label="전체보기"
              onPress={() => router.push("/favorite-events")}
            />
          </View>
        )}
      </SectionBody>
    );
  }, [favoriteEvents, hasMore, isLoading, isSignedIn]);

  return (
    <Section>
      <SectionTitle title="찜한 프로그램" />
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
