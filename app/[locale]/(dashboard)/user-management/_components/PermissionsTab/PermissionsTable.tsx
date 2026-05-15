"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  ActionIcon,
  Group,
  Text,
  ScrollArea,
  Center,
  Loader,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { getColumns } from "./columns";
import type { TenantPermission } from "@/services/tenant-permission/types";
import type { TenantRole } from "@/services/tenant-role/types";

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

interface PermissionsTableProps {
  data: TenantPermission[];
  roles: TenantRole[];
  isLoading?: boolean;
  onDelete: (permission: TenantPermission) => void;
}

export function PermissionsTable({
  data,
  roles,
  isLoading,
  onDelete,
}: PermissionsTableProps) {
  const t = useTranslations("userManagement.permissions");
  const columns = getColumns(t);

  const getRoleName = (roleId: string): string => {
    const role = (roles ?? []).find((r) => r.id === roleId);
    return role ? role.name : roleId;
  };

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  const rows = (data ?? []).map((permission) => (
    <Table.Tr key={permission.id}>
      <Table.Td>
        <Text size="sm" fw={500}>{permission.action}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{getRoleName(permission.role_id)}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{formatThaiDate(permission.created_at)}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap">
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => onDelete(permission)}
            aria-label="Delete permission"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>
                {col.label ? (
                  <Text size="sm" fw={500}>
                    {col.label}
                  </Text>
                ) : null}
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  );
}