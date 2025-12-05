import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import { FlashList } from "@shopify/flash-list";
import BasicEventItem from "@/components/basic-event-item";
import { useCallback, useState } from "react";
import { useScreenEffect } from "@/views/recently-viewed-events/context/use-screen-effect";
import { useRecentlyViewedEventsScreenView } from "@/views/recently-viewed-events/context/use-recently-viewed-events-screen-view";
import { useOperation } from "@/views/recently-viewed-events/context/use-operation";

export default function RecentlyViewedEventsScreenView() {
  useScreenEffect();

  const { events, isLoading, nextToken } = useRecentlyViewedEventsScreenView();
  const { loadNextPage } = useOperation();

  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(async () => {
    try {
      setIsLoadingMore(true);
      await loadNextPage();
    } finally {
      setIsLoadingMore(false);
    }
  }, [loadNextPage]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.navigationBar}>
        <Text style={styles.headerText}>최근 본 프로그램</Text>
      </SafeAreaView>

      <View style={styles.bodyView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <FlashList
            style={styles.flatListContainer}
            contentContainerStyle={styles.flatListContent}
            data={events}
            onEndReached={nextToken ? loadMore : null}
            onEndReachedThreshold={0.5}
            renderItem={({ item }) => (
              <BasicEventItem
                uuid={item.uuid}
                name={item.mainName}
                category={item.category}
                registrationStart={item.registrationSession.open}
                registrationEnd={item.registrationSession.close}
                eventStart={item.period.start}
                eventEnd={item.period.end}
                location={item.location}
                participationFee={item.fee}
                registrationStatus={item.registrationStatus}
                preventViewRecord
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separatorView} />}
            ListFooterComponent={
              isLoadingMore ? (
                <ActivityIndicator style={styles.loadingIndicator} />
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>최근에 본 내역이 없습니다</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.background,
  },

  navigationBar: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
    backgroundColor: Color.background,
    borderBottomWidth: 1,
    borderColor: Color.border,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: Color.text,
    fontFamily: "Pretendard",
  },

  bodyView: {
    flex: 1,
    backgroundColor: Color.surface,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  flatListContainer: {
    flex: 1,
  },

  flatListContent: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingTop: SizingScale[4],
    paddingBottom: SizingScale[12],
  },

  separatorView: {
    height: SizingScale[4],
  },

  loadingIndicator: {
    paddingVertical: 20,
  },

  emptyContainer: {
    paddingVertical: SizingScale[8],
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: Color.text,
    fontFamily: "Pretendard",
  },
});
