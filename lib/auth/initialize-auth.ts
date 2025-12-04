import { User, UserService } from "@/lib/services";
import { supabase } from "@/lib/supabase";

export async function initializeAuth() {
  let user: User | null = null;

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.log(
      "Initializing auth state failed: " + (error?.message ?? "Unknown Error"),
    );
  }

  if (data.session !== null) {
    try {
      const result = await UserService.getOrCreateUser();
      user = result.user;
    } catch (error) {
      console.log("Sign in failed: " + error);
    }
  }

  return user;
}
