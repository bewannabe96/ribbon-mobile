import { useEffect } from "react";
import { useOperation } from "@/views/recommend/context/use-operation";

export function useScreenEffect() {
  const { loadRecommendations } = useOperation();

  useEffect(() => {
    loadRecommendations().then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
