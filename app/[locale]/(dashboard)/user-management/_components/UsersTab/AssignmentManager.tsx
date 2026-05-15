"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Badge,
  ActionIcon,
  Group,
  Stack,
  Text,
  Select,
  Button,
  Divider,
} from "@mantine/core";
import { IconX, IconPlus } from "@tabler/icons-react";
import type { AssignmentData } from "@/services/user.types";
import type { Tenant } from "@/services/tenant.types";
import type { TenantRole } from "@/services/tenant-role.types";

interface AssignmentManagerProps {
  assignments: AssignmentData[];
  onChange: (assignments: AssignmentData[]) => void;
  tenants: Tenant[];
  roles: TenantRole[];
}

export function AssignmentManager({
  assignments,
  onChange,
  tenants,
  roles,
}: AssignmentManagerProps) {
  const t = useTranslations("userManagement");
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.id,
    label: tenant.name,
  }));

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleRemove = (assignmentId: string) => {
    onChange(assignments.filter((a) => a.id !== assignmentId));
  };

  const handleAdd = () => {
    if (!selectedTenant || !selectedRole) return;

    const isDuplicate = assignments.some(
      (a) => a.tenantId === selectedTenant && a.roleId === selectedRole
    );
    if (isDuplicate) return;

    const tenant = tenants.find((t) => t.id === selectedTenant);
    const role = roles.find((r) => r.id === selectedRole);

    const newAssignment: AssignmentData = {
      id: `new-${Date.now()}`,
      tenantId: selectedTenant,
      tenantName: tenant?.name ?? "",
      roleId: selectedRole,
      roleName: role?.name ?? "",
      permissions: [],
    };

    onChange([...assignments, newAssignment]);
    setSelectedTenant(null);
    setSelectedRole(null);
  };

  return (
    <Stack gap="sm">
      <Text fw={600} size="sm">{t("drawer.assignmentsSection")}</Text>

      {assignments.length === 0 ? (
        <Text c="dimmed" size="sm" ta="center" py="sm">
          {t("noAssignments")}
        </Text>
      ) : (
        <Stack gap={4}>
          {assignments.map((assignment) => (
            <Group key={assignment.id} justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap">
                <Text size="sm">{assignment.tenantName}</Text>
                <Badge variant="light" color="orange" size="sm">
                  {assignment.roleName}
                </Badge>
              </Group>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onClick={() => handleRemove(assignment.id)}
                aria-label={t("removeAssignment")}
              >
                <IconX size={14} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}

      <Divider my="xs" />

      <Text fw={600} size="sm">{t("drawer.addAssignmentSection")}</Text>

      <Group gap="xs" align="flex-end">
        <Select
          label={t("modal.tenantLabel")}
          placeholder={t("modal.tenantPlaceholder")}
          data={tenantOptions}
          value={selectedTenant}
          onChange={setSelectedTenant}
          searchable
          w={180}
        />
        <Select
          label={t("modal.roleLabel") === t("modal.roleLabel") ? "Role" : t("modal.roleLabel")}
          placeholder="Select role"
          data={roleOptions}
          value={selectedRole}
          onChange={setSelectedRole}
          searchable
          w={180}
        />
        <Button
          leftSection={<IconPlus size={16} />}
          size="sm"
          onClick={handleAdd}
          disabled={!selectedTenant || !selectedRole}
        >
          {t("addAssignment")}
        </Button>
      </Group>
    </Stack>
  );
}