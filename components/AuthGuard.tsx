"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/navigation";
import { Loader, Center } from "@mantine/core";
import AppShellLayout from "@/components/AppShellLayout";
import { useAppStore } from "@/store/useAppStore";
import { usePermissionStore } from "@/store/usePermissionStore";
import { authentication } from "@/services/authentication";
import { tenant } from "@/services/tenant";
import { deriveRole } from "@/utils/role";

const VERIFY_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const token = useAppStore((state) => state.token);
  const setLogout = useAppStore((state) => state.setLogout);
  const setUserRole = useAppStore((state) => state.setUserRole);
  const [hydrated, setHydrated] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const lastVerified = useRef<number>(0);

  // Hydration gate — with timeout fallback in case persist never fires
  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsub = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    // Fallback: if hydration never fires (storage corrupted), force after 2s
    const timeout = setTimeout(() => {
      setHydrated(true);
    }, 2000);

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, []);

  // Redirect to login if not authenticated after hydration
  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated || !token) {
      setLogout();
      router.replace("/");
    }
  }, [hydrated, isAuthenticated, token, router, setLogout]);

  // Verify token with /me — runs on mount and on navigation if cooldown has elapsed
  // Also fetches the policy catalog for permission checks and derives user role
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !token) return;

    const now = Date.now();
    if (now - lastVerified.current < VERIFY_COOLDOWN_MS) return;

    const verify = async () => {
      lastVerified.current = Date.now();
      setVerifying(true);

      try {
        await authentication.me();
        await usePermissionStore.getState().fetchPolicies();
        await usePermissionStore.getState().fetchUserPermissions();

        // Derive user role from tenant hierarchy
        const { user } = useAppStore.getState();
        if (user) {
          const tenants = await tenant.list();
          const role = deriveRole(user, tenants);
          setUserRole(role);
        }
      } catch (err: any) {
        // Only logout if token is actually invalid (401), not on server errors
        if (err?.status === 401) {
          setLogout();
          router.replace("/");
        }
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [hydrated, isAuthenticated, token, router, setLogout, setUserRole]);

  // Wait for hydration
  if (!hydrated) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  // Not authenticated — show loader while redirect happens
  if (!isAuthenticated || !token) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  // Verifying token — show loader to prevent content flash
  if (verifying) {
    return (
      <Center mih="100vh">
        <Loader />
      </Center>
    );
  }

  return <AppShellLayout>{children}</AppShellLayout>;
}