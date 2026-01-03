import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StorageStats } from "../types";
import { api } from "../services/api";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  rootDir: string;
  role: string;
}

interface UserContextType {
  user: UserProfile | null;
  storage: StorageStats;
  theme: "light" | "dark";
  isAuthenticated: boolean;
  isLoading: boolean;
  toggleTheme: (theme: "light" | "dark") => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: (id: any) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to get initial theme from localStorage or system preference
const getInitialTheme = (): "light" | "dark" => {
  // Check localStorage first
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  // Fallback to system preference
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [storage, setStorage] = useState<StorageStats>({
    used: 0,
    total: 0,
    type: "Free",
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync theme with DOM - runs on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const data = await api.getCurrentUser();
        setUser({
          name: data.name,
          email: data.email,
          avatar: data.avatar,
          rootDir: data.rootDir,
          role: data.role,
        });
        setStorage(data.storage);
        localStorage.setItem("rootDir", data.rootDir);
      } catch (err) {
        console.error(
          "[Auth] Session validation failed. Redirecting to login.",
        );
        localStorage.removeItem("cloudzoon_session");
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const data = await api.signIn(email, password);
      setUser({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        rootDir: data.rootDir,
        role: data.role,
      });
      setStorage(data.storage);
      localStorage.setItem("rootDir", data.rootDir);
    } catch (err) {
      console.error("[Auth] Login failed:", err);
      throw err;
    }
  };

  const loginWithGoogle = async (id: any) => {
    try {
      const data = await api.loginWithGoogle(id);
      setUser({
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        rootDir: data.rootDir,
        role: data.role,
      });
      setStorage(data.storage);
      localStorage.setItem("rootDir", data.rootDir);
    } catch (err) {
      console.error("[Auth] Google login failed:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("[Auth] Logout API failed", err);
    } finally {
      localStorage.removeItem("cloudzoon_session");
      localStorage.removeItem("rootDir");
      setUser(null);
      setStorage({ used: 0, total: 0, type: "Free" });
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    await api.updateProfile(updates);
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const toggleTheme = (newTheme: "light" | "dark") => setTheme(newTheme);

  return (
    <UserContext.Provider
      value={{
        user,
        storage,
        theme,
        isAuthenticated: !!user,
        isLoading,
        toggleTheme,
        updateUserProfile,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("useUser must be used within UserProvider");
  return context;
};
