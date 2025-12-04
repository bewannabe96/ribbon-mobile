import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useCallback } from "react";
import { Color, Sizing, SizingScale, StaticColor } from "@/constants/theme";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";

const PROVIDER_COLOR = {
  kakao: { text: "#1e1e1e", background: "#ffcd02" },
  naver: { text: "#ffffff", background: "#03c75a" },
  apple: { text: "#ffffff", background: "#000000" },
};

export default function SignInScreenView() {
  const { signInWithNaver, signInWithKakao, signInWithApple } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignin = useCallback(
    async (provider: "naver" | "kakao" | "apple") => {
      if (loading) return;
      try {
        setLoading(true);

        let success: boolean;
        switch (provider) {
          case "naver":
            success = await signInWithNaver();
            break;
          case "kakao":
            success = await signInWithKakao();
            break;
          case "apple":
            success = await signInWithApple();
            break;
        }

        if (success) {
          router.back();
        }
      } catch {
        Alert.alert("로그인 실패", "로그인에 실패하였습니다.");
      } finally {
        setLoading(false);
      }
    },
    [loading, signInWithApple, signInWithKakao, signInWithNaver],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.navigationBar} edges={["top"]}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => router.back()}>
          <X size={SizingScale[8]} />
        </TouchableOpacity>
      </SafeAreaView>

      <View style={styles.bodyView}>
        <Text style={styles.logoText}>리본</Text>
        <Text style={styles.sloganText}>인생의 모든 순간을 즐겁게</Text>
        <View style={styles.buttonView}>
          {/*<TouchableOpacity*/}
          {/*  style={[*/}
          {/*    styles.buttonBasic,*/}
          {/*    {*/}
          {/*      backgroundColor: PROVIDER_COLOR.naver.background,*/}
          {/*      opacity: loading ? 0.5 : 1,*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*  disabled={loading}*/}
          {/*  activeOpacity={0.6}*/}
          {/*  onPress={handleSignin.bind(null, "naver")}*/}
          {/*>*/}
          {/*  <Image*/}
          {/*    source={require("@/assets/logo/naver.svg")}*/}
          {/*    style={styles.buttonIcon}*/}
          {/*    contentFit="contain"*/}
          {/*    tintColor={PROVIDER_COLOR.naver.text}*/}
          {/*  />*/}
          {/*  <Text*/}
          {/*    style={[*/}
          {/*      styles.buttonTextBasic,*/}
          {/*      { color: PROVIDER_COLOR.naver.text },*/}
          {/*    ]}*/}
          {/*  >*/}
          {/*    네이버로 시작하기*/}
          {/*  </Text>*/}
          {/*</TouchableOpacity>*/}
          <TouchableOpacity
            style={[
              styles.buttonBasic,
              {
                backgroundColor: PROVIDER_COLOR.kakao.background,
                opacity: loading ? 0.5 : 1,
              },
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
              {
                backgroundColor: PROVIDER_COLOR.apple.background,
                opacity: loading ? 0.5 : 1,
              },
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
    backgroundColor: Color.background,
  },

  navigationBar: {
    justifyContent: "flex-end",
    paddingHorizontal: Sizing.screenPaddingX,
    paddingVertical: 20,
    flexDirection: "row",
    gap: 16,
    backgroundColor: Color.background,
  },

  bodyView: {
    flex: 1,
    paddingHorizontal: Sizing.screenPaddingX,
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontFamily: "Jalnan2",
    fontSize: 84,
    color: StaticColor.indigo600,
  },

  sloganText: {
    fontSize: 16,
    marginBottom: 56,
    color: Color.text,
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
