import "react-native-get-random-values"; //! This is for 'crypto' inside 'nanoid'
import { supabase } from "@/lib/supabase";
import { GetOrCreateUserResponseDto } from "@/lib/services/dto";
import { User } from "@/lib/services/dto/common.dto";
import { customAlphabet } from "nanoid";

class UserService {
  /**
   * Generates a random 6-digit number string.
   * @returns A string containing 6 random digits
   */
  private static generateRandomDigits(): string {
    return Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
  }

  /**
   * Generates a unique identifier using nanoid (16 characters, alphanumeric only).
   * @returns A nanoid string with 16 characters
   */
  private static generateUid(): string {
    const nanoid = customAlphabet(
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
      16,
    );
    return nanoid();
  }

  /**
   * Fetches a random username prefix from the database.
   * @returns A random prefix string
   */
  private static async getRandomPrefix(): Promise<string> {
    const { data, error } = await supabase
      .from("username_prefix")
      .select("prefix");

    if (error || !data || data.length === 0) {
      throw new Error("Failed to fetch username prefix");
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].prefix;
  }

  /**
   * Fetches a random username suffix from the database.
   * @returns A random suffix string
   */
  private static async getRandomSuffix(): Promise<string> {
    const { data, error } = await supabase
      .from("username_suffix")
      .select("suffix");

    if (error || !data || data.length === 0) {
      throw new Error("Failed to fetch username suffix");
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].suffix;
  }

  /**
   * Generates a random username in the format: <prefix>-<suffix>-<6 digits>.
   * @returns A generated username string
   */
  private static async generateUsername(): Promise<string> {
    const [prefix, suffix] = await Promise.all([
      UserService.getRandomPrefix(),
      UserService.getRandomSuffix(),
    ]);
    const randomDigits = UserService.generateRandomDigits();
    return `${prefix}${suffix}-${randomDigits}`;
  }

  /**
   * Maps database user row to User DTO.
   * @param data - User data from database
   * @returns User DTO
   */
  private static mapToUser(data: {
    uid: string;
    username: string;
    email: string | null;
    profile_image_url: string | null;
    created_at: string;
  }): User {
    return {
      uid: data.uid,
      username: data.username,
      email: data.email,
      profileImageUrl: data.profile_image_url,
      createdAt: data.created_at,
    };
  }

  /**
   * Gets an existing user or creates a new one.
   * If authId is provided, searches by auth_id first.
   * If email is provided and user not found by authId, searches by email.
   * If no user is found, creates a new user with randomly generated username.
   * @returns User information and whether the user is newly created
   */
  static async getOrCreateUser(): Promise<GetOrCreateUserResponseDto> {
    // mimics access token parsing
    const { data: authData, error: authError } = await supabase.auth.getUser();
    const authUser = authData.user;

    if (authError || authUser === null) {
      // refers to 401 if this were server
      throw new Error(
        "Authentication failed: " + (authError?.message ?? "User not found"),
      );
    }

    // Try to find existing user by auth_id
    const { data: existingByAuthId } = await supabase
      .from("user")
      .select("uid, username, email, profile_image_url, created_at")
      .eq("auth_id", authUser.id)
      .single();

    if (existingByAuthId) {
      return {
        user: UserService.mapToUser(existingByAuthId),
        isNew: false,
      };
    }

    const uid = UserService.generateUid();
    const username = await UserService.generateUsername();

    const { data, error } = await supabase
      .from("user")
      .insert({ uid, username })
      .select("uid, username, email, profile_image_url, created_at")
      .single();

    if (error || !data) {
      throw new Error(
        "Failed to create user: " + (error?.message ?? "Unknown error"),
      );
    }

    return {
      user: UserService.mapToUser(data),
      isNew: true,
    };
  }
}

export default UserService;
