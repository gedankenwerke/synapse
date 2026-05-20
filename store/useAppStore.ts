import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { LoginRequestUser } from "../services/authentication/types";

const AUTH_COOKIE = "auth_token";
const REFRESH_COOKIE = "refresh_token";
const COOKIE_MAX_AGE_DAYS = 7;

interface AppState {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  setColorScheme: (scheme: "light" | "dark") => void;

  user: LoginRequestUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setLogin: (accessToken: string, refreshToken: string, user: LoginRequestUser) => void;
  setLogout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
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

function setAuthCookies(accessToken: string, refreshToken: string) {
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const options: Cookies.CookieAttributes = {
    path: "/",
    expires: COOKIE_MAX_AGE_DAYS,
    sameSite: "Strict",
    ...(isSecure && { secure: true }),
  };
  Cookies.set(AUTH_COOKIE, accessToken, options);
  Cookies.set(REFRESH_COOKIE, refreshToken, options);
}

function removeAuthCookies() {
  Cookies.remove(AUTH_COOKIE, { path: "/" });
  Cookies.remove(REFRESH_COOKIE, { path: "/" });
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
      refreshToken: null,
      isAuthenticated: false,

      setLogin: (accessToken, refreshToken, user) => {
        setAuthCookies(accessToken, refreshToken);
        set({ token: accessToken, refreshToken, user, isAuthenticated: true });
      },
      setLogout: () => {
        removeAuthCookies();
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false });
      },
      updateTokens: (accessToken, refreshToken) => {
        setAuthCookies(accessToken, refreshToken);
        set({ token: accessToken, refreshToken });
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

// Derived helper — not stored in state, survives rehydration
export function isSuperAdmin(): boolean {
  return useAppStore.getState().user?.tenant_id === "1";
}

// Listen for token refresh events from the axios interceptor
if (typeof window !== "undefined") {
  window.addEventListener("token-refreshed", ((e: CustomEvent) => {
    const { accessToken, refreshToken } = e.detail;
    useAppStore.getState().updateTokens(accessToken, refreshToken);
  }) as EventListener);

  window.addEventListener("token-refresh-failed", () => {
    useAppStore.getState().setLogout();
  });
}