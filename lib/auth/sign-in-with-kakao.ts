import KakaoUser from "@react-native-kakao/user";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Sha256 } from "@aws-crypto/sha256-js";
import { supabase } from "@/lib/supabase";
import { User, UserService } from "@/lib/services";
import { initializeKakaoSDK } from "@react-native-kakao/core";

initializeKakaoSDK(process.env.EXPO_PUBLIC_KAKAO_APP_KEY || "").then();

type KakaoJwtPayload = {
  nickname: string;
  picture: string;
} & JwtPayload;

export async function signInWithKakao(): Promise<User | null> {
  let idToken: string | null;
  try {
    const token = await KakaoUser.login();
    idToken = token.idToken ?? null;
  } catch {
    return null;
  }

  if (!idToken) {
    throw new Error("Identity token is missing");
  }

  const decoded = jwtDecode<KakaoJwtPayload>(idToken);
  const aud = decoded.aud;
  const sub = decoded.sub;

  if (typeof aud !== "string" || typeof sub !== "string") {
    throw new Error("Identity token is malformed");
  }

  // email
  const proxyEmail = `${sub}@kakao.proxy.com`;

  // password
  const hash = new Sha256();
  hash.update(`${aud}::${sub}`);
  const proxyPassword = Array.from(await hash.digest())
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");

  // username
  const username =
    decoded.nickname +
    "-" +
    Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");

  // profile image url
  const profileImageUrl = decoded.picture.replace("http://", "https://");

  const credentials = { email: proxyEmail, password: proxyPassword };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  let supabaseUser = data.user;

  if (error) {
    if (error.code !== "invalid_credentials") {
      throw new Error("Error while signing in: " + error.code);
    }

    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp(credentials);

    supabaseUser = signUpData.user;

    if (signUpError) {
      throw new Error("Error while signing up: " + error.code);
    }
  }

  if (supabaseUser === null) {
    throw new Error("Supabase user not found");
  }

  try {
    const result = await UserService.getOrCreateUser();
    let user = result.user;
    if (result.isNew) {
      user = await UserService.updateUser({ username, profileImageUrl });
    }
    return user;
  } catch (error) {
    console.log("Error while fetching user data: " + error);
    throw new Error("Error while signing in");
  }
}
