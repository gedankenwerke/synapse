"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { usePermissionStore } from "@/store/usePermissionStore";
import { useAppStore } from "@/store/useAppStore";
import { getHomePath } from "@/utils/role";
import type { PolicyName } from "@/services/policy/types";

export function usePageGuard(policy: PolicyName): { allowed: boolean; loading: boolean } {
  const router = useRouter();
  const canSeePage = usePermissionStore((s) => s.canSeePage);
  const isLoading = usePermissionStore((s) => s.isLoading);
  const userRole = useAppStore((s) => s.userRole);

  const allowed = canSeePage(policy);

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace(getHomePath(userRole));
    }
  }, [allowed, isLoading, router, userRole]);

  return { allowed, loading: isLoading };
}