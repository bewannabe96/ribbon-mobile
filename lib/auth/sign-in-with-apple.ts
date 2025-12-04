import * as AppleAuthentication from "expo-apple-authentication";
import { CodedError } from "expo-modules-core";
import { supabase } from "@/lib/supabase";
import { User, UserService } from "@/lib/services";

export async function signInWithApple(): Promise<User | null> {
  let identityToken: string | null = null;

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      ],
    });

    identityToken = credential.identityToken;
  } catch (error) {
    if (error instanceof CodedError && error.code === "ERR_REQUEST_CANCELED") {
      return null;
    } else {
      throw new Error("Authentication failed: " + error);
    }
  }

  if (identityToken === null) {
    throw new Error("Identity token is missing");
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "apple",
    token: identityToken,
  });

  if (error !== null) {
    throw new Error("Error while signing in: " + error.message);
  } else if (data.user === null) {
    throw new Error("Error while signing in: User does not exist");
  }

  try {
    const result = await UserService.getOrCreateUser();
    return result.user;
  } catch (error) {
    console.error("Error while fetching user data: " + error);
    throw new Error("Error while signing in");
  }
}
