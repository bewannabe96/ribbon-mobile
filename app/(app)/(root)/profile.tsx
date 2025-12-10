import ProfileScreenView from "@/views/profile/profile-screen-view";
import { ProfileProvider } from "@/views/profile/context/profile-screen-context";

export default function ProfileScreen() {
  return (
    <ProfileProvider>
      <ProfileScreenView />
    </ProfileProvider>
  );
}
