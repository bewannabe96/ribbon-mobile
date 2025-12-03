import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Section,
  SectionBody,
  SectionSeparator,
} from "@/components/ui/section";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Sizing } from "@/constants/theme";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback } from "react";
import * as WebBrowser from "expo-web-browser";

export default function ProfileScreen() {
  const themeTint = useThemeColor("tint");
  const themeBackground = useThemeColor("background");
  const themeText = useThemeColor("text");

  const onTermsOfServicePressed = useCallback(async () => {
    await WebBrowser.openBrowserAsync("https://www.naver.com");
  }, []);

  const onPrivacyPolicyPressed = useCallback(async () => {
    await WebBrowser.openBrowserAsync("https://www.naver.com");
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={[styles.navigationBar, { backgroundColor: themeBackground }]}
        edges={["top"]}
      >
        <Text style={[styles.headerText, { color: themeText }]}>내 정보</Text>
      </SafeAreaView>

      <Section>
        <SectionBody>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: themeTint }]}
            onPress={() => router.push("/sign-in")}
            activeOpacity={0.6}
          >
            <Text style={[styles.buttonText, { color: themeBackground }]}>
              로그인 / 회원가입
            </Text>
          </TouchableOpacity>
        </SectionBody>
      </Section>

      <SectionSeparator />

      <Section>
        <View style={styles.listButtonView}>
          <TouchableOpacity
            style={styles.listButton}
            onPress={onTermsOfServicePressed}
          >
            <Text style={[styles.listButtonText, { color: themeText }]}>
              서비스 이용약관
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={themeText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listButton}
            onPress={onPrivacyPolicyPressed}
          >
            <Text style={[styles.listButtonText, { color: themeText }]}>
              개인정보처리 방침
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={themeText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listButton}>
            <Text style={[styles.listButtonText, { color: themeText }]}>
              고객센터
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={themeText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.listButton}>
            <Text style={[styles.listButtonText, { color: themeText }]}>
              피드백
            </Text>
            <MaterialIcons name="chevron-right" size={20} color={themeText} />
          </TouchableOpacity>
          {/*<TouchableOpacity style={styles.listButton}>*/}
          {/*  <Text style={[styles.listButtonText, { color: themeText }]}>*/}
          {/*    로그아웃*/}
          {/*  </Text>*/}
          {/*  <MaterialIcons name="chevron-right" size={20} color={themeText} />*/}
          {/*</TouchableOpacity>*/}
        </View>
      </Section>
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
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  loginButton: {
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    gap: 12,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  listButtonView: {
    gap: 12,
  },

  listButton: {
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  listButtonText: {
    fontSize: 16,
  },
});
