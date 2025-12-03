import { Stack } from "expo-router";
import SplashScreenView from "@/views/splash/splash-screen-view";
import { useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export const unstable_settings = {
  anchor: "(root)",
};

export default function AppLayout() {
  const { isInitialized, initialize: initializeAuth } = useAuth();

  const isLoading = useMemo(() => !isInitialized, [isInitialized]);

  useEffect(() => {
    initializeAuth().then();
  }, []);

  if (isLoading) {
    return <SplashScreenView />;
  } else {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(root)" />
        <Stack.Screen name="sign-in" options={{ presentation: "modal" }} />
      </Stack>
    );
  }
}
