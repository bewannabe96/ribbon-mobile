import { EventDetailProvider } from "@/views/event-detail/context/event-detail-screen-context";
import { EventDetailScreenView } from "@/views/event-detail/event-detail-screen-view";

export default function EventDetailScreen() {
  return (
    <EventDetailProvider>
      <EventDetailScreenView />
    </EventDetailProvider>
  );
}
