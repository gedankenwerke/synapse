"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Group,
  Select,
  TextInput,
  Button,
  Table,
  ActionIcon,
  Text,
  ScrollArea,
  Center,
  Loader,
  Stack,
  Tabs,
} from "@mantine/core";
import { IconSearch, IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";
import type { TenantPermission } from "@/services/tenant-permission/types";
import { EditRoleDrawer } from "../RolesTab/EditRoleDrawer";
import { AgentTab } from "./AgentTab";
import { ActionGuard } from "@/components/ActionGuard";

const TH_TZ = "Asia/Bangkok";

function formatThaiDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    timeZone: TH_TZ,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface PermissionsTabProps {
  tenants: Tenant[];
  roles: TenantRole[];
  permissions: TenantPermission[];
  isLoading?: boolean;
  permissionsLoading?: boolean;
  isToggling?: boolean;
  onTogglePermission: (action: string, enabled: boolean) => void;
  onAddDept: () => void;
  onEditDept: (tenant: Tenant) => void;
  onDeleteDept: (tenant: Tenant) => void;
  onAddAgent: () => void;
  onEditAgent: (tenant: Tenant) => void;
  onDeleteAgent: (tenant: Tenant) => void;
  onAddRole: () => void;
  onEditRole: (role: TenantRole) => void;
  onDeleteRole: (role: TenantRole) => void;
}

export function PermissionsTab({
  tenants,
  roles,
  permissions,
  isLoading,
  permissionsLoading,
  isToggling,
  onTogglePermission,
  onAddDept,
  onEditDept,
  onDeleteDept,
  onAddAgent,
  onEditAgent,
  onDeleteAgent,
  onAddRole,
  onEditRole,
  onDeleteRole,
}: PermissionsTabProps) {
  const t = useTranslations("userManagement");
  const tr = useTranslations("userManagement.roles");

  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [roleSearch, setRoleSearch] = useState("");
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [drawerRole, setDrawerRole] = useState<TenantRole | null>(null);

  const deptOptions = tenants.map((tenant) => ({
    value: tenant.ID,
    label: tenant.Name,
  }));

  const filteredRoles = roles.filter((r) => {
    if (selectedDeptId && r.TenantID !== selectedDeptId) return false;
    if (roleSearch && !r.Name.toLowerCase().includes(roleSearch.toLowerCase())) return false;
    return true;
  });

  const rolePermissions = drawerRole
    ? permissions.filter((p) => p.RoleID === drawerRole.ID)
    : [];

  const handleEditRole = (role: TenantRole) => {
    setDrawerRole(role);
    setDrawerOpened(true);
  };

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Group gap="sm">
          <Select
            placeholder={t("tenants.modal.parentPlaceholder")}
            data={deptOptions}
            value={selectedDeptId}
            onChange={setSelectedDeptId}
            clearable
            w={250}
          />
          <ActionGuard action="CreateTenant">
            <Button variant="light" size="xs" onClick={onAddDept}>
              {t("tenants.addTenant")}
            </Button>
          </ActionGuard>
        </Group>
        <Group gap="sm">
          <TextInput
            placeholder={tr("searchPlaceholder")}
            leftSection={<IconSearch size={16} />}
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.currentTarget.value)}
            w={250}
          />
          <ActionGuard action="CreateTenantRole">
            <Button leftSection={<IconPlus size={16} />} onClick={onAddRole}>
              {tr("addRole")}
            </Button>
          </ActionGuard>
        </Group>
      </Group>

      {selectedDeptId && (() => {
        const dept = tenants.find((t) => t.ID === selectedDeptId);
        return dept ? (
          <Group gap={4} mt={-8}>
            <ActionGuard action="UpdateTenant">
              <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => onEditDept(dept)} aria-label="Edit tenant">
                <IconPencil size={14} />
              </ActionIcon>
            </ActionGuard>
            <ActionGuard action="DeleteTenant">
              <ActionIcon variant="subtle" color="red" size="sm" onClick={() => onDeleteDept(dept)} aria-label="Delete tenant">
                <IconTrash size={14} />
              </ActionIcon>
            </ActionGuard>
          </Group>
        ) : null;
      })()}

      {selectedDeptId ? (
        <Tabs defaultValue="senior">
          <Tabs.List>
            <Tabs.Tab value="senior">{t("tab.senior")}</Tabs.Tab>
            <Tabs.Tab value="agent">{t("tab.agent")}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="senior" pt="md">
            <ScrollArea>
              <Table striped highlightOnHover withTableBorder>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th><Text size="sm" fw={500}>{tr("colName")}</Text></Table.Th>
                    <Table.Th><Text size="sm" fw={500}>{tr("colTenant")}</Text></Table.Th>
                    <Table.Th><Text size="sm" fw={500}>{tr("colCreated")}</Text></Table.Th>
                    <Table.Th><Text size="sm" fw={500}>{""}</Text></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredRoles.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={4}>
                        <Text c="dimmed" ta="center" py="lg">{tr("noRoles") ?? "No roles found"}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    filteredRoles.map((role) => {
                      const tenantMap = new Map((tenants ?? []).map((t) => [t.ID, t.Name]));
                      return (
                        <Table.Tr key={role.ID}>
                          <Table.Td><Text size="sm" fw={500}>{role.Name}</Text></Table.Td>
                          <Table.Td><Text size="sm">{tenantMap.get(role.TenantID) ?? "—"}</Text></Table.Td>
                          <Table.Td><Text size="sm">{formatThaiDate(role.CreatedAt)}</Text></Table.Td>
                          <Table.Td>
                            <Group gap={4} wrap="nowrap">
                              <ActionGuard action="UpdateTenantRole">
                                <ActionIcon variant="subtle" color="blue" onClick={() => handleEditRole(role)} aria-label="Edit role">
                                  <IconPencil size={16} />
                                </ActionIcon>
                              </ActionGuard>
                              <ActionGuard action="DeleteTenantRole">
                                <ActionIcon variant="subtle" color="red" onClick={() => onDeleteRole(role)} aria-label="Delete role">
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </ActionGuard>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="agent" pt="md">
            <AgentTab
              tenants={tenants}
              parentTenantId={selectedDeptId}
              isLoading={isLoading}
              onAddAgent={onAddAgent}
              onEditAgent={onEditAgent}
              onDeleteAgent={onDeleteAgent}
            />
          </Tabs.Panel>
        </Tabs>
      ) : (
        <ScrollArea>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th><Text size="sm" fw={500}>{tr("colName")}</Text></Table.Th>
                <Table.Th><Text size="sm" fw={500}>{tr("colTenant")}</Text></Table.Th>
                <Table.Th><Text size="sm" fw={500}>{tr("colCreated")}</Text></Table.Th>
                <Table.Th><Text size="sm" fw={500}>{""}</Text></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredRoles.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <Text c="dimmed" ta="center" py="lg">{tr("noRoles") ?? "No roles found"}</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredRoles.map((role) => {
                  const tenantMap = new Map((tenants ?? []).map((t) => [t.ID, t.Name]));
                  return (
                    <Table.Tr key={role.ID}>
                      <Table.Td><Text size="sm" fw={500}>{role.Name}</Text></Table.Td>
                      <Table.Td><Text size="sm">{tenantMap.get(role.TenantID) ?? "—"}</Text></Table.Td>
                      <Table.Td><Text size="sm">{formatThaiDate(role.CreatedAt)}</Text></Table.Td>
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <ActionGuard action="UpdateTenantRole">
                            <ActionIcon variant="subtle" color="blue" onClick={() => handleEditRole(role)} aria-label="Edit role">
                              <IconPencil size={16} />
                            </ActionIcon>
                          </ActionGuard>
                          <ActionGuard action="DeleteTenantRole">
                            <ActionIcon variant="subtle" color="red" onClick={() => onDeleteRole(role)} aria-label="Delete role">
                              <IconTrash size={16} />
                            </ActionIcon>
                          </ActionGuard>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      )}

      <EditRoleDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        role={drawerRole}
        permissions={rolePermissions}
        tenants={tenants}
        onToggle={onTogglePermission}
        isToggling={isToggling}
        isLoading={permissionsLoading}
      />
    </Stack>
  );
}