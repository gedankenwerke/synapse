import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { LoginRequestUser } from "../services/authentication/types";
import type { UserRole } from "@/utils/role";
import { SUPERADMIN_TENANT_ID } from "@/utils/role";

const ACCESS_TOKEN_COOKIE = "auth_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";
const COOKIE_MAX_AGE_DAYS = 7;

interface AppState {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  setColorScheme: (scheme: "light" | "dark") => void;

  user: LoginRequestUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  userRole: UserRole;

  setLogin: (accessToken: string, refreshToken: string, user: LoginRequestUser) => void;
  setLogout: () => void;
  updateToken: (token: string) => void;
  setUserRole: (role: UserRole) => void;
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

function setCookie(name: string, value: string) {
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  Cookies.set(name, value, {
    path: "/",
    expires: COOKIE_MAX_AGE_DAYS,
    sameSite: "Strict",
    ...(isSecure && { secure: true }),
  });
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
      userRole: "agent" as UserRole,

      setLogin: (accessToken, refreshToken, user) => {
        const isSuperAdmin = user.tenant_id === SUPERADMIN_TENANT_ID;
        setCookie(ACCESS_TOKEN_COOKIE, accessToken);
        setCookie(REFRESH_TOKEN_COOKIE, refreshToken);
        set({ token: accessToken, user, isAuthenticated: true, isSuperAdmin });
      },
      setLogout: () => {
        Cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" });
        Cookies.remove(REFRESH_TOKEN_COOKIE, { path: "/" });
        set({ token: null, user: null, isAuthenticated: false, isSuperAdmin: false, userRole: "agent" as UserRole });
      },
      updateToken: (token: string) => {
        setCookie(ACCESS_TOKEN_COOKIE, token);
        set({ token });
      },
      setUserRole: (role: UserRole) => {
        set({ userRole: role });
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => safeLocalStorage()),
      onRehydrateStorage: () => (state) => {
        if (state && state.isAuthenticated && !state.token) {
          state.isAuthenticated = false;
          state.user = null;
        }
        try {
          localStorage.removeItem("_zugang");
        } catch {}
      },
    }
  )
);

if (typeof window !== "undefined") {
  window.addEventListener("token-refreshed", ((e: CustomEvent) => {
    const newToken = e.detail as string;
    useAppStore.getState().updateToken(newToken);
  }) as EventListener);

  window.addEventListener("token-refresh-failed", () => {
    useAppStore.getState().setLogout();
  });
}