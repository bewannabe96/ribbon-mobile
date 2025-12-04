import { AppState } from "react-native";
import { supabase } from "@/lib/supabase";

import { initializeAuth } from "./initialize-auth";
import { signInWithApple } from "./sign-in-with-apple";
import { signInWithNaver } from "./sign-in-with-naver";
import { signInWithKakao } from "./sign-in-with-kakao";
import { signOut } from "./sign-out";

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh().then();
  } else {
    supabase.auth.stopAutoRefresh().then();
  }
});

const Auth = {
  initializeAuth,
  signInWithApple,
  signInWithNaver,
  signInWithKakao,
  signOut,
};

export default Auth;
