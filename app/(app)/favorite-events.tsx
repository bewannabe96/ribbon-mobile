import FavoriteEventsScreenView from "@/views/favorite-events/favorite-events-screen-view";
import { FavoriteEventsProvider } from "@/views/favorite-events/context/favorite-events-screen-context";

export default function FavoriteEventsScreen() {
  return (
    <FavoriteEventsProvider>
      <FavoriteEventsScreenView />
    </FavoriteEventsProvider>
  );
}
