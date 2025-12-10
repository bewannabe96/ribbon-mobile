import { supabase } from "@/lib/supabase";

export async function deleteAccount() {
  // Get the current session (includes user info and access token)
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error("No active session");

  // Call Edge Function to delete account
  const { data, error } = await supabase.functions.invoke("delete-account");

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}
