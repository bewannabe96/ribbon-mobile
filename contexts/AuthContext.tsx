import {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
  useMemo,
} from "react";
import { User } from "@/lib/services";
import Auth from "@/lib/auth";

interface AuthContextType {
  isInitialized: boolean;
  setIsInitialized: (value: boolean) => void;

  user: User | null;
  setUser: (value: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({} as any);

export function AuthProvider(props: PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);
  // const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        setIsInitialized,

        user,
        setUser,
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

  const initialize = useCallback(async () => {
    const user = await Auth.initializeAuth();
    context.setUser(user);
    context.setIsInitialized(true);
  }, [context]);

  const signInWithApple = useCallback(async (): Promise<boolean> => {
    const user = await Auth.signInWithApple();

    if (user === null) return false;

    context.setUser(user);
    return true;
  }, [context]);

  const signInWithNaver = useCallback(async (): Promise<boolean> => {
    const user = await Auth.signInWithNaver();

    if (user === null) return false;

    // context.setUser(user)
    return true;
  }, []);

  const signInWithKakao = useCallback(async (): Promise<boolean> => {
    const user = await Auth.signInWithKakao();

    if (user === null) return false;

    context.setUser(user);
    return true;
  }, [context]);

  const signOut = useCallback(async () => {
    await Auth.signOut();
    context.setUser(null);
  }, [context]);

  const deleteAccount = useCallback(async () => {
    await Auth.deleteAccount();
    context.setUser(null);
  }, [context]);

  const isSignedIn = useMemo(() => {
    return context.user !== null;
  }, [context.user]);

  return {
    isInitialized: context.isInitialized,
    user: context.user,
    initialize,
    signInWithApple,
    signInWithNaver,
    signInWithKakao,
    signOut,
    deleteAccount,
    isSignedIn,
  };
};
