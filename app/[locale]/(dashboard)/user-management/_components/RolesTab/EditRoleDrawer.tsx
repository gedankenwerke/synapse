"use client";

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
import type { TenantRole } from "@/services/tenant-role/types";
import type { TenantPermission } from "@/services/tenant-permission/types";
import type { Tenant } from "@/services/tenant/types";
import { PERMISSION_CATEGORIES } from "./permissionActions";

interface EditRoleDrawerProps {
  opened: boolean;
  onClose: () => void;
  role: TenantRole | null;
  permissions: TenantPermission[];
  tenants: Tenant[];
  onToggle: (action: string, enabled: boolean) => void;
  isToggling?: boolean;
  isLoading?: boolean;
}

export function EditRoleDrawer({
  opened,
  onClose,
  role,
  permissions,
  tenants,
  onToggle,
  isToggling,
  isLoading,
}: EditRoleDrawerProps) {
  const t = useTranslations("userManagement.roles.permissions");
  const tr = useTranslations("userManagement.roles");

  if (!role) return null;

  const tenantMap = new Map((tenants ?? []).map((t) => [t.id, t.name]));
  const tenantName = tenantMap.get(role.tenant_id) ?? "—";

  const enabledActions = new Set(permissions.map((p) => p.action));

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
          <Text fw={700} size="lg">{role.name}</Text>
          <Badge variant="light">{tenantName}</Badge>
        </Group>
        <Text size="sm" c="dimmed" mb="sm">
          {t("title", { role: role.name })}
        </Text>

        <Divider my="sm" />

        {isLoading ? (
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
                      checked={enabledActions.has(action)}
                      onChange={(e) => onToggle(action, e.currentTarget.checked)}
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