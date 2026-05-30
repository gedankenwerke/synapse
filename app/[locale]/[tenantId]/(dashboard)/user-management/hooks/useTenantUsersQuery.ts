import { useQuery } from "@tanstack/react-query";
import { tenantUser } from "@/services/tenant-user";

interface TenantUsersQueryParams {
  tenantId?: string;
  userId?: string;
}

export function useTenantUsersQuery(params?: TenantUsersQueryParams) {
  return useQuery({
    queryKey: ["tenant-users", params?.tenantId, params?.userId],
    queryFn: () =>
      tenantUser.list({
        ...(params?.tenantId && { tenant_id: params.tenantId }),
        ...(params?.userId && { user_id: params.userId }),
      }),
    staleTime: 60_000,
  });
}