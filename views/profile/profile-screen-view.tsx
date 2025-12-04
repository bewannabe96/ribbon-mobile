import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { SafeAreaView } from "react-native-safe-area-context";
import { Section, SectionBody } from "@/components/ui/section";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import Button from "@/components/ui/button";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronRight } from "lucide-react-native";
import { Image } from "expo-image";

export default function ProfileScreenView() {
  const { isSignedIn, user, signOut } = useAuth();

  const onTermsOfServicePressed = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_TERMS_OF_SERVICE_URL;
    if (url) await WebBrowser.openBrowserAsync(url);
  }, []);

  const onPrivacyPolicyPressed = useCallback(async () => {
    const url = process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL;
    if (url) await WebBrowser.openBrowserAsync(url);
  }, []);

  const onSignOut = useCallback(() => {
    Alert.alert("로그아웃", "정말로 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "확인", onPress: signOut },
    ]);
  }, [signOut]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.navigationBar} edges={["top"]}>
        <Text style={styles.headerText}>내 정보</Text>
      </SafeAreaView>

      <View style={styles.bodyView}>
        <Section>
          <SectionBody>
            {user ? (
              <View style={styles.profileView}>
                {user.profileImageUrl && (
                  <Image
                    style={styles.profileImage}
                    source={user.profileImageUrl}
                    contentFit="cover"
                  />
                )}
                <View>
                  <View style={styles.usernameView}>
                    <Text style={styles.usernameText}>{user.username}</Text>
                    <Text style={styles.usernameSuffixText}>님</Text>
                  </View>
                  <Text style={styles.usernameSuffixText}>안녕하세요!</Text>
                </View>
              </View>
            ) : (
              <Button
                label="로그인 / 회원가입"
                variant="outline"
                size="lg"
                onPress={() => router.push("/sign-in")}
              />
            )}
          </SectionBody>
        </Section>

        <Section>
          <View style={styles.listButtonView}>
            <TouchableOpacity
              style={styles.listButton}
              onPress={onTermsOfServicePressed}
            >
              <Text style={styles.listButtonText}>서비스 이용약관</Text>
              <ChevronRight size={20} color={Color.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listButton}
              onPress={onPrivacyPolicyPressed}
            >
              <Text style={styles.listButtonText}>개인정보처리 방침</Text>
              <ChevronRight size={20} color={Color.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.listButton}>
              <Text style={styles.listButtonText}>고객센터</Text>
              <ChevronRight size={20} color={Color.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.listButton}>
              <Text style={styles.listButtonText}>피드백</Text>
              <ChevronRight size={20} color={Color.text} />
            </TouchableOpacity>
            {isSignedIn && (
              <TouchableOpacity style={styles.listButton} onPress={onSignOut}>
                <Text style={styles.listButtonText}>로그아웃</Text>
                <ChevronRight size={20} color={Color.text} />
              </TouchableOpacity>
            )}
          </View>
        </Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  navigationBar: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: 18,
    backgroundColor: Color.background,
    borderBottomWidth: 1,
    borderColor: Color.border,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: Color.text,
  },

  bodyView: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[4],
    gap: SizingScale[4],
  },

  profileView: {
    flexDirection: "row",
    gap: SizingScale[1],
    alignItems: "center",
  },

  profileImage: {
    height: 64,
    width: 64,
    borderRadius: 64,
    backgroundColor: StaticColor.gray100,
    marginEnd: SizingScale[3],
  },

  usernameView: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SizingScale[1],
  },

  usernameText: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold",
    fontFamily: "Pretendard",
  },

  usernameSuffixText: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: "Pretendard",
  },

  listButtonView: {
    gap: SizingScale[4],
  },

  listButton: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: SizingScale[3],
    flexDirection: "row",
    justifyContent: "space-between",
  },

  listButtonText: {
    fontSize: 16,
    color: Color.text,
  },
});
