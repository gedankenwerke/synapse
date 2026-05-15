import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantPermission } from "@/services/tenant-permission";
import type { TenantPermissionCreateRequest } from "@/services/tenant-permission.types";

export function useCreateTenantPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TenantPermissionCreateRequest) =>
      tenantPermission.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-permissions"] });
    },
  });
}

export function useDeleteTenantPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantPermission.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-permissions"] });
    },
  });
}