import RecentlyViewedEventsScreenView from "@/views/recently-viewed-events/recently-viewed-events-screen-view";
import { RecentlyViewedEventsProvider } from "@/views/recently-viewed-events/context/recently-viewed-events-screen-context";

export default function RecentlyViewedEventsScreen() {
  return (
    <RecentlyViewedEventsProvider>
      <RecentlyViewedEventsScreenView />
    </RecentlyViewedEventsProvider>
  );
}
