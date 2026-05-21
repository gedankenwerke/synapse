import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantPermission } from "@/services/tenant-permission";
import type { AssignPermissionsRequest, DeassignPermissionsRequest } from "@/services/tenant-permission/types";

export function useAssignPermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, ...data }: AssignPermissionsRequest & { roleId: string }) =>
      tenantPermission.assign(roleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenant-permissions", variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ["tenant-roles"] });
    },
  });
}

export function useDeassignPermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ roleId, ...data }: DeassignPermissionsRequest & { roleId: string }) =>
      tenantPermission.deassign(roleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenant-permissions", variables.roleId] });
      queryClient.invalidateQueries({ queryKey: ["tenant-roles"] });
    },
  });
}