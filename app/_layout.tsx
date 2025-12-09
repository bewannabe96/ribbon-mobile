import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastManager from "toastify-react-native";
import SimpleToast from "@/components/ui/toast/simple";
import LoadingOverlay from "@/components/ui/loading-overlay";

export default function GlobalLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }} />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
      <ToastManager
        config={{ simple: (props: any) => <SimpleToast {...props} /> }}
        position="bottom"
        bottomOffset={100}
        showProgressBar={false}
        showCloseIcon={false}
        useModal={false}
        animationStyle="fade"
        duration={1500}
      />
      <LoadingOverlay />
    </AuthProvider>
  );
}
