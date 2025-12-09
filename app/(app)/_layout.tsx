import { Stack, usePathname } from "expo-router";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { analytics } from "@/lib";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync().then();

export const unstable_settings = {
  anchor: "(root)",
};

export default function AppLayout() {
  const { isInitialized, initialize: initializeAuth } = useAuth();
  const pathname = usePathname();

  const isLoading = useMemo(() => !isInitialized, [isInitialized]);

  useEffect(() => {
    analytics.initialize().then();
    initializeAuth().then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().then();
    }
  }, [isLoading]);

  useEffect(() => {
    analytics.trackScreen(pathname);
  }, [pathname]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(root)" />
      <Stack.Screen name="sign-in" options={{ presentation: "modal" }} />
    </Stack>
  );
}
