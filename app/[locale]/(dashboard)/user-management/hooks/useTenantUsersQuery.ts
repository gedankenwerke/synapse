import { useQuery } from "@tanstack/react-query";
import { tenantUser } from "@/services/tenant-user";

export function useTenantUsersQuery(userId?: string) {
  return useQuery({
    queryKey: ["tenant-users", userId],
    queryFn: () => tenantUser.list(userId ? { user_id: userId } : undefined),
    staleTime: 60_000,
  });
}