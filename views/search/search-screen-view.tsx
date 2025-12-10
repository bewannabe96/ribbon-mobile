import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import { useScreenEffect } from "@/views/search/context/use-screen-effect";
import { useSearchScreenView } from "@/views/search/context/use-search-screen-view";
import { useOperation } from "@/views/search/context/use-operation";
import { useCallback, useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import SubSearchFilters from "@/views/search/components/sub-search-filters";
import TopSearchFilters from "@/views/search/components/top-search-filters";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from "react-native-reanimated";
import BasicEventItem from "@/components/basic-event-item";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList,
) as typeof FlashList;

export default function SearchScreenView() {
  useScreenEffect();

  const { searchItems, nextToken, isSearching } = useSearchScreenView();
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

  // UI

  const [stickyViewHeight, setStickyViewHeight] = useState(0);
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);
  const headerTranslateY = useSharedValue(0);

  useEffect(() => {
    if (isSearching) {
      headerTranslateY.value = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching]);

  const onStickyViewLayout = useCallback(
    (event: { nativeEvent: { layout: { height: number } } }) => {
      setStickyViewHeight(event.nativeEvent.layout.height);
    },
    [],
  );

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      // Over scroll 무시
      if (currentY < 0) {
        lastScrollY.value = currentY;
        scrollY.value = currentY;
        return;
      }

      const diff = currentY - lastScrollY.value;

      // 이전 위치도 over scroll이었으면 무시
      if (lastScrollY.value < 0) {
        lastScrollY.value = currentY;
        scrollY.value = currentY;
        return;
      }

      // 스크롤 변화량만큼 헤더를 반대 방향으로 이동
      let newTranslateY = headerTranslateY.value - diff;

      // 0과 -stickyViewHeight 사이로 제한
      if (newTranslateY > 0) newTranslateY = 0;
      if (newTranslateY < -stickyViewHeight) newTranslateY = -stickyViewHeight;

      headerTranslateY.value = newTranslateY;

      lastScrollY.value = currentY;
      scrollY.value = currentY;
    },
  });

  const stickyViewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]}>
        <TopSearchFilters />
      </SafeAreaView>
      <View style={styles.bodyView}>
        <Animated.View
          style={[styles.stickyView, stickyViewAnimatedStyle]}
          onLayout={onStickyViewLayout}
        >
          <SubSearchFilters />
        </Animated.View>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <AnimatedFlashList
            style={styles.flatListContainer}
            contentContainerStyle={styles.flatListContent}
            data={searchItems}
            onScroll={handleScroll}
            onEndReached={nextToken ? loadMore : null}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={
              <View style={{ height: stickyViewHeight + SizingScale[4] }} />
            }
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
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separatorView} />}
            ListFooterComponent={
              isLoadingMore ? (
                <ActivityIndicator style={styles.loadingIndicator} />
              ) : null
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

  stickyView: {
    position: "absolute",
    width: "100%",
    top: 0,
    zIndex: 10,
  },

  bodyView: {
    flex: 1,
    backgroundColor: Color.surface,
    overflow: "hidden",
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
    paddingBottom: SizingScale[4],
  },

  separatorView: {
    height: SizingScale[4],
  },

  loadingIndicator: {
    paddingVertical: 20,
  },
});
