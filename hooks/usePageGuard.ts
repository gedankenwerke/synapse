"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { usePermissionStore } from "@/store/usePermissionStore";
import { getLayer } from "@/store/useAppStore";

/**
 * usePageGuard — for action-level gating within a layer.
 * Layer-level access is enforced by middleware and useAuthGuard.
 * This hook is for cases where a page should be hidden from a user
 * who lacks a specific RBAC action, even within their layer.
 */
export function usePageGuard(action: string): { allowed: boolean; loading: boolean } {
  const router = useRouter();
  const hasAction = usePermissionStore((s) => s.hasAction);
  const isLoading = usePermissionStore((s) => s.isLoading);
  const layer = getLayer();

  // Superadmins always have access
  if (layer === "superadmin") {
    return { allowed: true, loading: false };
  }

  const allowed = hasAction(action);

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace(`/${layer}/dashboard`);
    }
  }, [allowed, isLoading, router, layer]);

  return { allowed, loading: isLoading };
}