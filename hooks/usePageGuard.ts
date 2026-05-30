"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { useParams } from "next/navigation";
import { usePermissionStore } from "@/store/usePermissionStore";
import { tenantHomePath, SUPERADMIN_TENANT_ID } from "@/utils/role";
import type { PolicyName } from "@/services/policy/types";

export function usePageGuard(policy: PolicyName): { allowed: boolean; loading: boolean } {
  const router = useRouter();
  const params = useParams();
  const tenantId = (params.tenantId as string) || SUPERADMIN_TENANT_ID;
  const canSeePage = usePermissionStore((s) => s.canSeePage);
  const isLoading = usePermissionStore((s) => s.isLoading);

  const allowed = canSeePage(policy);

  useEffect(() => {
    if (!isLoading && !allowed && tenantId) {
      router.replace(tenantHomePath(tenantId));
    }
  }, [allowed, isLoading, router, tenantId]);

  return { allowed, loading: isLoading };
}