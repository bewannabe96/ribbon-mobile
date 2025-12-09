import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import ProfileSection from "./components/profile-section";
import FavoriteEventsSection from "./components/favorite-events-section";
import RecentlyViewedEventsSection from "./components/recently-viewed-events-section";
import SettingsSection from "./components/settings-section";
import { useScreenEffect } from "./context/use-screen-effect";
import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import { useLoadingStore } from "@/store";

export default function ProfileScreenView() {
  useScreenEffect();

  const { show, hide } = useLoadingStore();
  const { isSignedIn, deleteAccount } = useAuth();

  const onDeleteAccount = useCallback(async () => {
    const confirmed = await new Promise((resolve) =>
      Alert.alert(
        "회원탈퇴",
        "정말로 탈퇴하시겠습니까?\n\n모든 데이터가 영구적으로 삭제되며, 이 작업은 되돌릴 수 없습니다.",
        [
          { text: "취소", style: "cancel", onPress: resolve.bind(null, false) },
          {
            text: "탈퇴하기",
            style: "destructive",
            onPress: resolve.bind(null, true),
          },
        ],
      ),
    );

    if (!confirmed) return;

    try {
      show();
      await deleteAccount();
    } finally {
      hide();
    }
  }, [deleteAccount, hide, show]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.navigationBar} edges={["top"]}>
        <Text style={styles.headerText}>내 정보</Text>
      </SafeAreaView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileSection />
        <FavoriteEventsSection />
        <RecentlyViewedEventsSection />
        <SettingsSection />
        {isSignedIn && (
          <TouchableOpacity
            style={styles.deleteAccountButton}
            activeOpacity={0.6}
            onPress={onDeleteAccount}
          >
            <Text style={styles.deleteAccountText}>회원탈퇴</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[5],
    gap: SizingScale[4],
  },

  deleteAccountButton: {
    alignSelf: "center",
    padding: SizingScale[4],
    marginTop: SizingScale[10],
  },

  deleteAccountText: {
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "Pretendard",
    color: StaticColor.gray400,
  },
});
