"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "@/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Loader, Center } from "@mantine/core";

interface TenantGuardProps {
  tenantId: string;
  children: React.ReactNode;
}

export function TenantGuard({ tenantId, children }: TenantGuardProps) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const redirecting = useRef(false);

  useEffect(() => {
    // Wait until auth state is resolved
    if (!isAuthenticated || !user) return;

    // Superadmin can access any tenant
    if (isSuperAdmin) return;

    // Non-superadmin users can only access their own tenant
    if (tenantId !== user.tenant_id) {
      if (!redirecting.current) {
        redirecting.current = true;
        router.replace(`/${user.tenant_id}/dashboard`);
      }
    }
  }, [tenantId, user, isSuperAdmin, isAuthenticated, router]);

  // Not yet authenticated — let AuthGuard handle it
  if (!isAuthenticated || !user) {
    return <Center mih="100vh"><Loader /></Center>;
  }

  // Superadmin accessing any tenant: allow
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  // Non-superadmin accessing wrong tenant: show loader while redirecting
  if (tenantId !== user.tenant_id) {
    return <Center mih="100vh"><Loader /></Center>;
  }

  return <>{children}</>;
}