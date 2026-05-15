import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { LoginRequestUser } from "../services/authentication/types";

const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE_DAYS = 7;

interface AppState {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  setColorScheme: (scheme: "light" | "dark") => void;

  user: LoginRequestUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;

  setLogin: (token: string, user: LoginRequestUser) => void;
  setLogout: () => void;
  updateToken: (token: string) => void;
}

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function safeLocalStorage(): Storage {
  try {
    const storage = window.localStorage;
    const key = "__zustand_test__";
    storage.setItem(key, "1");
    storage.removeItem(key);
    return storage;
  } catch {
    return noopStorage as unknown as Storage;
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      colorScheme: "light",
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === "light" ? "dark" : "light",
        })),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),

      user: null,
      token: null,
      isAuthenticated: false,
      isSuperAdmin: false,

      setLogin: (token, user) => {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        Cookies.set(COOKIE_NAME, token, {
          path: "/",
          expires: COOKIE_MAX_AGE_DAYS,
          sameSite: "Strict",
          ...(isSecure && { secure: true }),
        });
        set({ token, user, isAuthenticated: true, isSuperAdmin: user.isSuperAdmin });
      },
      setLogout: () => {
        Cookies.remove(COOKIE_NAME, { path: "/" });
        set({ token: null, user: null, isAuthenticated: false, isSuperAdmin: false });
      },
      updateToken: (token: string) => {
        const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
        Cookies.set(COOKIE_NAME, token, {
          path: "/",
          expires: COOKIE_MAX_AGE_DAYS,
          sameSite: "Strict",
          ...(isSecure && { secure: true }),
        });
        set({ token });
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => safeLocalStorage()),
      onRehydrateStorage: () => (state) => {
        // If rehydrated state claims authenticated but token is missing, force logout
        if (state && state.isAuthenticated && !state.token) {
          state.isAuthenticated = false;
          state.user = null;
        }
        // Clean up legacy _zugang key from previous versions
        try {
          localStorage.removeItem("_zugang");
        } catch {}
      },
    }
  )
);

// Listen for token refresh events from the axios interceptor
if (typeof window !== "undefined") {
  window.addEventListener("token-refreshed", ((e: CustomEvent) => {
    const newToken = e.detail as string;
    useAppStore.getState().updateToken(newToken);
  }) as EventListener);

  window.addEventListener("token-refresh-failed", () => {
    useAppStore.getState().setLogout();
  });
}