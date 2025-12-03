import RecommendScreenView from "@/views/recommend/recommend-screen-view";
import { RecommendProvider } from "@/views/recommend/context/recommend-screen-context";

export default function RecommendScreen() {
  return (
    <RecommendProvider>
      <RecommendScreenView />
    </RecommendProvider>
  );
}
