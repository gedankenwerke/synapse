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
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { getColumns } from "./columns";
import type { TenantRole } from "@/services/tenant-role.types";
import type { Tenant } from "@/services/tenant.types";

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

interface RolesTableProps {
  data: TenantRole[];
  tenants: Tenant[];
  isLoading?: boolean;
  onEdit: (role: TenantRole) => void;
  onDelete: (role: TenantRole) => void;
}

export function RolesTable({
  data,
  tenants,
  isLoading,
  onEdit,
  onDelete,
}: RolesTableProps) {
  const t = useTranslations("userManagement.roles");
  const columns = getColumns(t);

  const tenantMap = new Map((tenants ?? []).map((t) => [t.id, t.name]));

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  const rows = (data ?? []).map((role) => (
    <Table.Tr key={role.id}>
      <Table.Td>
        <Text size="sm" fw={500}>{role.name}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{tenantMap.get(role.tenant_id) ?? "—"}</Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm">{formatThaiDate(role.created_at)}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4} wrap="nowrap">
          <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(role)} aria-label="Edit role">
            <IconPencil size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red" onClick={() => onDelete(role)} aria-label="Delete role">
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