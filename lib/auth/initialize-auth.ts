import { User, UserService } from "@/lib/services";
import { supabase } from "@/lib/supabase";
import { analytics } from "@/lib";

export async function initializeAuth() {
  let user: User | null = null;

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log(
      "Initializing auth state failed: " + (error?.message ?? "Unknown Error"),
    );
  }

  if (data.session !== null && data.session.user.email !== undefined) {
    try {
      const result = await UserService.getOrCreateUser(data.session.user.email);
      user = result.user;
    } catch (error) {
      console.log("Sign in failed: " + error);
    }
  }

  if (user !== null) {
    await analytics.identifyUser(
      user.uid,
      user.username,
      user.email,
      user.profileImageUrl,
    );
  }

  return user;
}
