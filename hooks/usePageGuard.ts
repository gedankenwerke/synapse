"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { usePermissionStore } from "@/store/usePermissionStore";
import type { PolicyName } from "@/services/policy/types";

export function usePageGuard(policy: PolicyName): { allowed: boolean; loading: boolean } {
  const router = useRouter();
  const canSeePage = usePermissionStore((s) => s.canSeePage);
  const isLoading = usePermissionStore((s) => s.isLoading);

  const allowed = canSeePage(policy);

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace("/dashboard");
    }
  }, [allowed, isLoading, router]);

  return { allowed, loading: isLoading };
}