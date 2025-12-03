import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  PropsWithChildren,
  useMemo,
} from "react";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { UserService, User } from "@/lib/services";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isInitialized: boolean;
  isSignedIn: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isInitialized: false,
  isSignedIn: false,
  initialize: async () => {},
  signOut: async () => {},
});

export function AuthProvider(props: PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const onSessionChange = useCallback(async (session: Session | null) => {
    if (session === null) {
      setUser(null);
      return;
    } else {
      try {
        const result = await UserService.getOrCreateUser();
        setUser(result.user);
      } catch (error) {
        console.error("Sign in failed: " + error);
      }
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const { data } = supabase.auth.onAuthStateChange(
      (_: AuthChangeEvent, session: Session | null) => setSession(session),
    );
    return () => data.subscription.unsubscribe();
  }, [isInitialized]);

  useEffect(() => {
    onSessionChange(session).then();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const initialize = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.log(
        "Initializing auth state failed: " +
          (error?.message ?? "Unknown Error"),
      );
    }

    setSession(data.session);
    setIsInitialized(true);
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const isSignedIn = useMemo(() => {
    return session !== null && user !== null;
  }, [session, user]);

  return (
    <AuthContext.Provider
      value={{
        session: session,
        user: user,
        isInitialized: isInitialized,
        isSignedIn: isSignedIn,
        initialize: initialize,
        signOut: signOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
