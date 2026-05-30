"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  Badge,
  ActionIcon,
  Group,
  Text,
  ScrollArea,
  Center,
  Loader,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { getColumns } from "./columns";

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
import type { UserData } from "@/services/user/types";
import { ActionGuard } from "@/components/ActionGuard";

interface UserTableProps {
  data: UserData[];
  isLoading?: boolean;
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
}

const MAX_VISIBLE_ASSIGNMENTS = 2;

export function UserTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: UserTableProps) {
  const t = useTranslations("userManagement");
  const columns = getColumns(t);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  const rows = data.map((user) => {
    const visibleAssignments = user.assignments.slice(0, MAX_VISIBLE_ASSIGNMENTS);
    const overflowCount = user.assignments.length - MAX_VISIBLE_ASSIGNMENTS;

    return (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Text size="sm" fw={500}>{user.username}</Text>
        </Table.Td>
        <Table.Td>
          {user.assignments.length > 0 ? (
            <Group gap={4} wrap="wrap">
              {visibleAssignments.map((a) => (
                <Badge key={a.id} variant="light" color="blue" size="sm">
                  {a.tenantName}: {a.roleName}
                </Badge>
              ))}
              {overflowCount > 0 && (
                <Badge variant="light" color="gray" size="sm">
                  {t("badgeMore", { count: overflowCount })}
                </Badge>
              )}
            </Group>
          ) : (
            <Text size="sm" c="dimmed">—</Text>
          )}
        </Table.Td>
        <Table.Td>
          <Text size="sm">{formatThaiDate(user.createdAt)}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap={4} wrap="nowrap">
            <ActionGuard action="UpdateUser">
              <ActionIcon variant="subtle" color="blue" onClick={() => onEdit(user)} aria-label="Edit user">
                <IconPencil size={16} />
              </ActionIcon>
            </ActionGuard>
            <ActionGuard action="DeleteUser">
              <ActionIcon variant="subtle" color="red" onClick={() => onDelete(user)} aria-label="Delete user">
                <IconTrash size={16} />
              </ActionIcon>
            </ActionGuard>
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