import { useQuery } from "@tanstack/react-query";
import { tenantPermission } from "@/services/tenant-permission";

export function useTenantPermissionsQuery(roleId: string) {
  return useQuery({
    queryKey: ["tenant-permissions", roleId],
    queryFn: () => tenantPermission.list(roleId),
    staleTime: 60_000,
    enabled: !!roleId,
  });
}