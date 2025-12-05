import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Color, Sizing, SizingScale } from "@/constants/theme";
import ProfileSection from "./components/profile-section";
import FavoriteEventsSection from "./components/favorite-events-section";
import RecentlyViewedEventsSection from "./components/recently-viewed-events-section";
import SettingsSection from "./components/settings-section";
import { useScreenEffect } from "./context/use-screen-effect";

export default function ProfileScreenView() {
  useScreenEffect();

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
});
