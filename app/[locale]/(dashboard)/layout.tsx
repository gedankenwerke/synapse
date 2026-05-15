"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/navigation";
import { Loader, Center } from "@mantine/core";
import AppShellLayout from "@/components/AppShellLayout";
import { useAppStore } from "@/store/useAppStore";
import { usePermissionStore } from "@/store/usePermissionStore";
import { authentication } from "@/services/authentication";

const VERIFY_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const token = useAppStore((state) => state.token);
  const setLogout = useAppStore((state) => state.setLogout);
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
  // Also fetches the policy catalog for permission checks
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
  }, [hydrated, isAuthenticated, token, router, setLogout]);

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