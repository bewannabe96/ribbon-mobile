import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

export function useRequireAuth<T extends (...args: any[]) => any>(func: T) {
  const { isSignedIn } = useAuth();

  return useCallback(
    (...args: Parameters<T>): ReturnType<T> | undefined => {
      if (!isSignedIn) {
        Alert.alert(
          "로그인이 필요한 기능입니다.",
          "로그인 페이지로 이동하시겠습니까?",
          [
            { text: "취소", style: "cancel" },
            { text: "확인", onPress: () => router.push("/sign-in") },
          ],
        );
        return;
      }

      return func(...args);
    },
    [func, isSignedIn],
  );
}
