"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Drawer,
  ScrollArea,
  Divider,
  Text,
  Checkbox,
  Stack,
  Group,
  Badge,
  Loader,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { TenantRole } from "@/services/tenant-role/types";
import type { Tenant } from "@/services/tenant/types";
import { useRolePermissionCache } from "@/store/useRolePermissionCache";
import { useAssignPermissions, useDeassignPermissions } from "../../hooks/useTenantRoleMutations";
import { PERMISSION_CATEGORIES } from "./permissionActions";

interface EditRoleDrawerProps {
  opened: boolean;
  onClose: () => void;
  role: TenantRole | null;
  tenants: Tenant[];
}

export function EditRoleDrawer({
  opened,
  onClose,
  role,
  tenants,
}: EditRoleDrawerProps) {
  const t = useTranslations("userManagement.roles.permissions");
  const tr = useTranslations("userManagement.roles");

  const cache = useRolePermissionCache();
  const assignMutation = useAssignPermissions();
  const deassignMutation = useDeassignPermissions();

  // Local state for checked actions, synced from cache when role changes
  const [localActions, setLocalActions] = useState<Set<string>>(new Set());
  const [isReady, setIsReady] = useState(false);

  // Sync local state from cache when role changes or drawer opens
  useEffect(() => {
    if (role) {
      const cached = cache.getRoleActions(role.ID);
      setLocalActions(new Set(cached));
      setIsReady(true);
    } else {
      setLocalActions(new Set());
      setIsReady(false);
    }
  }, [role?.ID, opened]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!role) return null;

  const tenantMap = new Map((tenants ?? []).map((t) => [t.ID, t.Name]));
  const tenantName = tenantMap.get(role.TenantID) ?? "—";

  const isToggling = assignMutation.isPending || deassignMutation.isPending;

  const handleToggle = (action: string, enabled: boolean) => {
    if (enabled) {
      // Assign permission
      assignMutation.mutate(
        { roleId: role.ID, actions: [action] },
        {
          onSuccess: () => {
            setLocalActions((prev) => new Set([...prev, action]));
            notifications.show({
              title: tr("success.updated"),
              message: t("success.permissionAdded"),
              color: "green",
            });
          },
          onError: (err: any) => {
            notifications.show({
              title: tr("error.updateFailed"),
              message: t("error.permissionAddFailed"),
              color: "red",
            });
          },
        }
      );
    } else {
      // Deassign permission
      deassignMutation.mutate(
        { roleId: role.ID, actions: [action] },
        {
          onSuccess: () => {
            setLocalActions((prev) => {
              const next = new Set(prev);
              next.delete(action);
              return next;
            });
            notifications.show({
              title: tr("success.updated"),
              message: t("success.permissionRemoved"),
              color: "green",
            });
          },
          onError: (err: any) => {
            notifications.show({
              title: tr("error.updateFailed"),
              message: t("error.permissionRemoveFailed"),
              color: "red",
            });
          },
        }
      );
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={tr("modal.editTitle")}
      position="right"
      size="500px"
      overlayProps={{ backgroundOpacity: 0.4 }}
    >
      <ScrollArea h="calc(100vh - 80px)" offsetScrollbars>
        <Group justify="space-between" mb="xs">
          <Text fw={700} size="lg">{role.Name}</Text>
          <Badge variant="light">{tenantName}</Badge>
        </Group>
        <Text size="sm" c="dimmed" mb="sm">
          {t("title", { role: role.Name })}
        </Text>

        <Divider my="sm" />

        {!isReady ? (
          <Center py="xl">
            <Loader size="sm" />
          </Center>
        ) : (
          <Stack gap="md">
            {PERMISSION_CATEGORIES.map((category) => (
              <div key={category.key}>
                <Text fw={600} size="sm" mb={4}>
                  {t(`categories.${category.key}`)}
                </Text>
                <Stack gap={4}>
                  {category.actions.map((action) => (
                    <Checkbox
                      key={action}
                      label={action}
                      checked={localActions.has(action)}
                      onChange={(e) => handleToggle(action, e.currentTarget.checked)}
                      disabled={isToggling}
                      size="sm"
                    />
                  ))}
                </Stack>
              </div>
            ))}
          </Stack>
        )}
      </ScrollArea>
    </Drawer>
  );
}