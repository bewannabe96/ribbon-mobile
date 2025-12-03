import { View, StyleSheet, Linking, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import { Phone, ExternalLink, Heart } from "lucide-react-native";
import { useCallback } from "react";
import { useEventDetailScreenView } from "@/views/event-detail/context/use-event-detail-screen-view";
import * as WebBrowser from "expo-web-browser";
import Button from "@/components/ui/button";
import Tooltip from "@/components/ui/tooltip";

export function EventDetailBottomBar() {
  const { eventDetail, registrationStatus, toggleFavorite } =
    useEventDetailScreenView();

  const handleToggleFavorite = useCallback(async () => {
    try {
      await toggleFavorite();
      // TODO toast
    } catch {
      // TODO toast
    }
  }, [toggleFavorite]);

  const onPhoneRegistration = useCallback(async () => {
    if (eventDetail === null || eventDetail.contactPhone === null) return;
    await Linking.openURL(`tel:${eventDetail.contactPhone}`);
  }, [eventDetail]);

  const onOnlineRegistration = useCallback(async () => {
    if (eventDetail === null) return;
    Alert.alert("외부 페이지로 이동", "온라인 신청 페이지로 이동합니다.", [
      { text: "취소", style: "cancel" },
      {
        text: "확인",
        onPress: async () => {
          await WebBrowser.openBrowserAsync(eventDetail.websiteUrl, {
            dismissButtonStyle: "close",
          });
        },
      },
    ]);
  }, [eventDetail]);

  const renderContent = useCallback(() => {
    if (eventDetail === null || registrationStatus === null) return null;

    if (registrationStatus.t === "upcoming") {
      return (
        <Tooltip
          content="🔔 찜하면 신청 시작 전에 미리 알려드려요!"
          position="top"
        >
          <Button
            label="찜하기"
            IconComponent={<Heart />}
            variant="outline"
            size="lg"
            flexFill
          />
        </Tooltip>
      );
    }

    if (registrationStatus.t === "closed") {
      return (
        <Button label="신청이 마감되었습니다" size="lg" flexFill disabled />
      );
    }

    return (
      <>
        <Button
          onPress={onOnlineRegistration}
          label="온라인 신청"
          IconComponent={<ExternalLink />}
          variant={eventDetail.contactPhone !== null ? "outline" : "primary"}
          size="lg"
          flexFill
        />
        {eventDetail.contactPhone !== null && (
          <Button
            onPress={onPhoneRegistration}
            label="전화 문의"
            IconComponent={<Phone />}
            variant="primary"
            size="lg"
            flexFill
          />
        )}
      </>
    );
  }, [
    eventDetail,
    onOnlineRegistration,
    onPhoneRegistration,
    registrationStatus,
  ]);

  if (!eventDetail) return null;
  else if (registrationStatus === null) return null;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.bottomBarContent}>{renderContent()}</View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: Color.border,
    backgroundColor: Color.background,
  },

  bottomBarContent: {
    flexDirection: "row",
    gap: SizingScale[3],
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
  },
});
