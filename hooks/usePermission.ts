import { usePermissionStore } from "../store/usePermissionStore";
import type { PolicyName } from "../services/policy/types";

export function usePermission() {
  const policies = usePermissionStore((s) => s.policies);
  const isLoading = usePermissionStore((s) => s.isLoading);
  const error = usePermissionStore((s) => s.error);
  const hasPermission = usePermissionStore((s) => s.hasPermission);
  const isSuperAdminOnly = usePermissionStore((s) => s.isSuperAdminOnly);

  return { policies, isLoading, error, hasPermission, isSuperAdminOnly };
}