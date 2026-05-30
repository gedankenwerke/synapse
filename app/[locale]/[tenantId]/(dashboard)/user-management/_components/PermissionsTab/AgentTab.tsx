"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  Text,
  Group,
  ActionIcon,
  Stack,
  Center,
  Loader,
  Button,
} from "@mantine/core";
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react";
import type { Tenant } from "@/services/tenant/types";
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

interface AgentTabProps {
  tenants: Tenant[];
  parentTenantId: string;
  isLoading?: boolean;
  onAddAgent: () => void;
  onEditAgent: (tenant: Tenant) => void;
  onDeleteAgent: (tenant: Tenant) => void;
}

export function AgentTab({
  tenants,
  parentTenantId,
  isLoading,
  onAddAgent,
  onEditAgent,
  onDeleteAgent,
}: AgentTabProps) {
  const t = useTranslations("userManagement.tenants");

  const agents = tenants.filter((tenant) => tenant.ParentID === parentTenantId);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <ActionGuard action="CreateTenant">
          <Button leftSection={<IconPlus size={16} />} onClick={onAddAgent}>
            {t("addTenant")}
          </Button>
        </ActionGuard>
      </Group>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th><Text size="sm" fw={500}>{t("colName")}</Text></Table.Th>
            <Table.Th><Text size="sm" fw={500}>{t("colCreated")}</Text></Table.Th>
            <Table.Th><Text size="sm" fw={500}>{""}</Text></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {agents.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={3}>
                <Text c="dimmed" ta="center" py="lg">No agents found</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            agents.map((agent) => (
              <Table.Tr key={agent.ID}>
                <Table.Td><Text size="sm" fw={500}>{agent.Name}</Text></Table.Td>
                <Table.Td><Text size="sm">{formatThaiDate(agent.CreatedAt)}</Text></Table.Td>
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <ActionGuard action="UpdateTenant">
                      <ActionIcon variant="subtle" color="blue" size="sm" onClick={() => onEditAgent(agent)} aria-label="Edit agent">
                        <IconPencil size={14} />
                      </ActionIcon>
                    </ActionGuard>
                    <ActionGuard action="DeleteTenant">
                      <ActionIcon variant="subtle" color="red" size="sm" onClick={() => onDeleteAgent(agent)} aria-label="Delete agent">
                        <IconTrash size={14} />
                      </ActionIcon>
                    </ActionGuard>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>
    </Stack>
  );
}