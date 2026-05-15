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

interface TenantsTableProps {
  data: Tenant[];
  tenants: Tenant[];
  isLoading?: boolean;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

export function TenantsTable({
  data,
  tenants,
  isLoading,
  onEdit,
  onDelete,
}: TenantsTableProps) {
  const t = useTranslations("userManagement.tenants");
  const columns = getColumns(t);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  const parentMap = new Map((tenants ?? []).map((t) => [t.id, t.name]));

  const rows = (data ?? []).map((tenant) => {
    const parentName =
      tenant.parent_id === "0"
        ? t("rootLabel")
        : parentMap.get(tenant.parent_id) ?? "—";

    return (
      <Table.Tr key={tenant.id}>
        <Table.Td>
          <Text size="sm" fw={500}>{tenant.name}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{parentName}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{formatThaiDate(tenant.created_at)}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap={4} wrap="nowrap">
            <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(tenant)} aria-label="Edit tenant">
              <IconPencil size={16} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="red" onClick={() => onDelete(tenant)} aria-label="Delete tenant">
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

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