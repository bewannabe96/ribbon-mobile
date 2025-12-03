import { supabase } from "@/lib/supabase";
import * as AppleAuthentication from "expo-apple-authentication";
import { CodedError } from "expo-modules-core";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import KakaoUser from "@react-native-kakao/user";
import NaverLogin from "@react-native-seoul/naver-login";

NaverLogin.initialize({
  appName: process.env.EXPO_PUBLIC_NAVER_APP_NAME || "",
  consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID || "",
  consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET || "",
  serviceUrlSchemeIOS: process.env.EXPO_PUBLIC_NAVER_SCHEME || "",
  disableNaverAppAuthIOS: true,
});

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_APP_KEY || "").then();

export async function signInWithNaver() {
  const response = await NaverLogin.login();

  // TODO
}

export async function signInWithKakao() {
  const token = await KakaoUser.login();

  if (!token.idToken) {
    throw new Error("Identity token is missing");
  }

  // TODO
}

export async function signInWithApple() {
  let identityToken: string | null = null;

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
    });

    identityToken = credential.identityToken;
  } catch (e) {
    if (e instanceof CodedError && e.code === "ERR_REQUEST_CANCELED") {
      return;
    } else {
      throw e;
    }
  }

  if (identityToken === null) {
    throw new Error("Identity token is missing");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: identityToken,
  });

  if (error !== null) {
    throw new Error("Error while signing in: " + error.message);
  }
}
