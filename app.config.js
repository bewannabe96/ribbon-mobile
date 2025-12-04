module.exports = {
  expo: {
    name: "Ribbon",
    slug: "ribbon",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "ribbon",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "dev.b1ob.ribbon",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      usesAppleSignIn: true,
      buildNumber: "25120401",
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      package: "dev.b1ob.ribbon",
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            extraMavenRepos: [
              "https://devrepo.kakao.com/nexus/content/groups/public/",
            ],
          },
        },
      ],
      "expo-router",
      "expo-secure-store",
      "expo-web-browser",
      "expo-apple-authentication",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-font",
        {
          fonts: [
            "./assets/fonts/Jalnan2-Regular.otf",
            "./assets/fonts/Pretendard-Thin.otf",
            "./assets/fonts/Pretendard-ExtraLight.otf",
            "./assets/fonts/Pretendard-Light.otf",
            "./assets/fonts/Pretendard-Regular.otf",
            "./assets/fonts/Pretendard-Medium.otf",
            "./assets/fonts/Pretendard-SemiBold.otf",
            "./assets/fonts/Pretendard-Bold.otf",
            "./assets/fonts/Pretendard-ExtraBold.otf",
            "./assets/fonts/Pretendard-Black.otf",
          ],
          android: {
            fonts: [
              {
                fontFamily: "Jalnan2",
                fontDefinitions: [
                  {
                    path: "./assets/fonts/Jalnan2-Regular.otf",
                    weight: 400,
                  },
                ],
              },
            ],
          },
        },
      ],
      [
        "@react-native-kakao/core",
        {
          nativeAppKey: process.env.EXPO_PUBLIC_KAKAO_APP_KEY,
          android: { authCodeHandlerActivity: true },
          ios: { handleKakaoOpenUrl: true },
        },
      ],
      [
        "@react-native-seoul/naver-login",
        {
          // appName: process.env.EXPO_PUBLIC_NAVER_APP_NAME,
          // clientId: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID,
          // clientSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET,
          urlScheme: process.env.EXPO_PUBLIC_NAVER_SCHEME,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "0ea9d1e3-1065-48ca-bb6f-54ea3bb91c25",
      },
    },
  },
};
