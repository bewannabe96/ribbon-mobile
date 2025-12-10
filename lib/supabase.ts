import * as SecureStore from "expo-secure-store";
import { createClient, processLock } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase-types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabasePublishableKey =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

const SecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value).then();
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key).then();
  },
};

export const supabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      storage: SecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      lock: processLock,
    },
  },
);
