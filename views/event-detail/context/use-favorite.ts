import { useCallback } from "react";
import { Toast } from "toastify-react-native";
import { useOperation } from "@/views/event-detail/context/use-operation";
import { useScreenContext } from "@/views/event-detail/context/event-detail-screen-context";
import { useRequireAuth } from "@/hooks/use-require-auth";

export function useFavorite() {
  const { isFavorite, isProcessingFavorite, setIsProcessingFavorite } =
    useScreenContext();
  const { toggleFavorite: _toggleFavorite } = useOperation();

  const toggleFavorite = useCallback(async () => {
    try {
      setIsProcessingFavorite(true);
      Toast.show({
        type: "simple" as any,
        text1: isFavorite
          ? "찜 목록에서 삭제되었습니다"
          : "찜 목록에 추가되었습니다",
      });
      await _toggleFavorite();
    } catch {
      Toast.show({
        type: "simple" as any,
        text1: isFavorite
          ? "찜 목록에서 삭제 중 오류가 발생했어요"
          : "찜 목록에 추가 중 오류가 발생했어요",
      });
    } finally {
      setIsProcessingFavorite(false);
    }
  }, [_toggleFavorite, isFavorite, setIsProcessingFavorite]);

  return {
    isFavorite,
    isProcessingFavorite,
    toggleFavorite: useRequireAuth(toggleFavorite),
  };
}
