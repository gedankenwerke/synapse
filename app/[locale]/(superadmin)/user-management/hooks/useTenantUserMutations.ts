import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantUser } from "@/services/tenant-user";
import type { TenantUserCreateRequest, TenantUserUpdateRequest } from "@/services/tenant-user/types";

export function useCreateTenantUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TenantUserCreateRequest) => tenantUser.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateTenantUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TenantUserUpdateRequest }) =>
      tenantUser.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteTenantUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tenantUser.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-users"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}