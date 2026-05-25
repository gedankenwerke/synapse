import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantRole } from "@/services/tenant-role";
import type { TenantRoleCreateRequest, TenantRoleUpdateRequest } from "@/services/tenant-role/types";

export function useCreateTenantRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TenantRoleCreateRequest) => tenantRole.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-roles"] });
    },
  });
}

export function useUpdateTenantRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TenantRoleUpdateRequest }) =>
      tenantRole.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-roles"] });
    },
  });
}

export function useDeleteTenantRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantRole.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-roles"] });
    },
  });
}