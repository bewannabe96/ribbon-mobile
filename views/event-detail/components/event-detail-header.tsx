import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import { router } from "expo-router";
import { useCallback } from "react";
import { ChevronLeft, Heart, Share2 } from "lucide-react-native";
import { useEventDetailScreenView } from "@/views/event-detail/context/use-event-detail-screen-view";

export function EventDetailHeader() {
  const { isFavorite, externalShareUrl, toggleFavorite } =
    useEventDetailScreenView();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleToggleFavorite = useCallback(async () => {
    try {
      await toggleFavorite();
      // TODO toast
    } catch {
      // TODO toast
    }
  }, [toggleFavorite]);

  const handleShare = useCallback(() => {
    // TODO: Implement share
    console.log(externalShareUrl);
  }, [externalShareUrl]);

  return (
    <SafeAreaView edges={["top"]} style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.headerButton}
          activeOpacity={0.6}
        >
          <ChevronLeft size={24} color={StaticColor.gray900} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.headerButton}
            activeOpacity={0.6}
          >
            <Heart
              size={24}
              color={isFavorite ? StaticColor.indigo600 : StaticColor.gray900}
              fill={isFavorite ? StaticColor.indigo600 : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerButton}
            activeOpacity={0.6}
          >
            <Share2 size={24} color={StaticColor.gray900} />
          </TouchableOpacity>
        </View>
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
    gap: SizingScale[2],
  },
});
