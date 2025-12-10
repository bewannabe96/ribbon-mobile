import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import { router } from "expo-router";
import { useCallback } from "react";
import { ChevronLeft, Heart, Share2 } from "lucide-react-native";
import { useEventDetailScreenView } from "@/views/event-detail/context/use-event-detail-screen-view";
import { useFavorite } from "@/views/event-detail/context/use-favorite";

export function EventDetailHeader() {
  const { eventDetail, externalShareUrl } = useEventDetailScreenView();
  const { toggleFavorite, isProcessingFavorite, isFavorite } = useFavorite();

  const handleShare = useCallback(() => {
    // TODO: Implement share
    console.log(externalShareUrl);
  }, [externalShareUrl]);

  return (
    <SafeAreaView edges={["top"]} style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={router.back}
          style={styles.headerButton}
          activeOpacity={0.6}
        >
          <ChevronLeft size={26} color={StaticColor.gray900} />
        </TouchableOpacity>
        {eventDetail !== null && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              activeOpacity={0.6}
              onPress={toggleFavorite}
              disabled={isProcessingFavorite}
            >
              <Heart
                size={26}
                color={isFavorite ? StaticColor.red500 : StaticColor.gray900}
                fill={isFavorite ? StaticColor.red500 : "transparent"}
              />
            </TouchableOpacity>
            {/* TODO: hide temporarily */}
            {/*<TouchableOpacity*/}
            {/*  onPress={handleShare}*/}
            {/*  style={styles.headerButton}*/}
            {/*  activeOpacity={0.6}*/}
            {/*>*/}
            {/*  <Share2 size={26} color={StaticColor.gray900} />*/}
            {/*</TouchableOpacity>*/}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.background,
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
  },

  headerButton: {
    padding: SizingScale[1],
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SizingScale[4],
  },
});
