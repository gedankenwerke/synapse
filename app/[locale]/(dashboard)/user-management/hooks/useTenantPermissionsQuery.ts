import { useQuery } from "@tanstack/react-query";
import { tenantPermission } from "@/services/tenant-permission";

export function useTenantPermissionsQuery() {
  return useQuery({
    queryKey: ["tenant-permissions"],
    queryFn: () => tenantPermission.list(),
    staleTime: 60_000,
  });
}