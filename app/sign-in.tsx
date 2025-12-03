import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState, useCallback } from "react";
import { Sizing } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { signInWithApple, signInWithKakao, signInWithNaver } from "@/lib/oauth";

const PROVIDER_COLOR = {
  kakao: { text: "#1e1e1e", background: "#ffcd02" },
  naver: { text: "#ffffff", background: "#03c75a" },
  apple: { text: "#ffffff", background: "#000000" },
};

export default function SignInScreen() {
  const themeBackground = useThemeColor("background");
  const themeText = useThemeColor("text");
  const themeTint = useThemeColor("tint");
  const [loading, setLoading] = useState(false);

  const handleSignin = useCallback(
    async (provider: "naver" | "kakao" | "apple") => {
      if (loading) return;
      try {
        setLoading(true);
        switch (provider) {
          case "naver":
            await signInWithNaver();
            break;
          case "kakao":
            await signInWithKakao();
            break;
          case "apple":
            await signInWithApple();
            break;
        }
      } catch (error) {
        console.log(error);
        Alert.alert("로그인 실패", "로그인 중 오류가 발생했습니다.");
      } finally {
        // TODO: is not released with naver login cancel
        setLoading(false);
      }
    },
    [loading],
  );

  return (
    <View style={[styles.container, { backgroundColor: themeBackground }]}>
      <SafeAreaView
        style={[styles.navigationBar, { backgroundColor: themeBackground }]}
        edges={["top"]}
      >
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.back()}>
          <MaterialIcons size={28} name="close" color={themeText} />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.bodyView}>
        <Text style={[styles.logoText, { color: themeTint }]}>오소</Text>
        <Text style={[styles.sloganText, { color: themeText }]}>
          어느때보다 인생을 즐겁게
        </Text>
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={[
              styles.buttonBasic,
              { backgroundColor: PROVIDER_COLOR.naver.background },
            ]}
            disabled={loading}
            activeOpacity={0.6}
            onPress={handleSignin.bind(null, "naver")}
          >
            <Image
              source={require("@/assets/logo/naver.svg")}
              style={styles.buttonIcon}
              contentFit="contain"
              tintColor={PROVIDER_COLOR.naver.text}
            />
            <Text
              style={[
                styles.buttonTextBasic,
                { color: PROVIDER_COLOR.naver.text },
              ]}
            >
              네이버로 시작하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonBasic,
              { backgroundColor: PROVIDER_COLOR.kakao.background },
            ]}
            disabled={loading}
            activeOpacity={0.6}
            onPress={handleSignin.bind(null, "kakao")}
          >
            <Image
              source={require("@/assets/logo/kakao.svg")}
              style={styles.buttonIcon}
              contentFit="contain"
              tintColor={PROVIDER_COLOR.kakao.text}
            />
            <Text
              style={[
                styles.buttonTextBasic,
                { color: PROVIDER_COLOR.kakao.text },
              ]}
            >
              카카오로 시작하기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.buttonBasic,
              { backgroundColor: PROVIDER_COLOR.apple.background },
            ]}
            disabled={loading}
            activeOpacity={0.6}
            onPress={handleSignin.bind(null, "apple")}
          >
            <Image
              source={require("@/assets/logo/apple.svg")}
              style={styles.buttonIcon}
              contentFit="contain"
              tintColor={PROVIDER_COLOR.apple.text}
            />
            <Text
              style={[
                styles.buttonTextBasic,
                { color: PROVIDER_COLOR.apple.text },
              ]}
            >
              Apple로 시작하기
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 20,
    flexDirection: "row",
    gap: 16,
  },

  bodyView: {
    flex: 1,
    paddingHorizontal: Sizing.screenPaddingX,
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontFamily: "Black Han Sans",
    fontSize: 84,
  },

  sloganText: {
    fontSize: 16,
    marginBottom: 56,
  },

  buttonView: {
    alignSelf: "stretch",
    gap: 14,
  },

  buttonBasic: {
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    gap: 12,
  },

  buttonTextBasic: {
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonIcon: {
    width: 16,
    height: 16,
  },
});
