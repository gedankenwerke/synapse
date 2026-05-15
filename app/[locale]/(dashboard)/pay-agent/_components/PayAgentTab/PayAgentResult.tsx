"use client";

import {
  Card,
  Group,
  Stack,
  Text,
  SimpleGrid,
  Badge,
  Divider,
  Box,
  CopyButton,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { PayAgentResponse } from "@/services/pay-agent.types";

interface PayAgentResultProps {
  result: PayAgentResponse;
}

function CopyableField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="sm" c="dimmed" mb={4}>
        {label}
      </Text>
      <Group gap={4}>
        <Text size="sm" fw={500} ff="monospace">
          {value}
        </Text>
        <CopyButton value={value}>
          {({ copied, copy }) => (
            <ActionIcon
              size="xs"
              color={copied ? "teal" : "gray"}
              variant="subtle"
              onClick={copy}
            >
              {copied ? <IconCheck size={12} /> : <IconCopy size={12} />}
            </ActionIcon>
          )}
        </CopyButton>
      </Group>
    </div>
  );
}

export function PayAgentResult({ result }: PayAgentResultProps) {
  const t = useTranslations("payAgent");

  return (
    <Card
      withBorder
      shadow="sm"
      padding="lg"
      radius="md"
      style={{ borderColor: "var(--mantine-color-green-4)" }}
    >
      <Group gap="sm" mb="md">
        <IconCheck size={20} color="var(--mantine-color-green-6)" />
        <Text fw={600}>{t("result.successTitle")}</Text>
        <Badge color="green" variant="light">
          {result.backend}
        </Badge>
      </Group>

      <Divider my="sm" />

      <SimpleGrid cols={2}>
        <CopyableField label={t("result.clientId")} value={result.client_id} />
        <CopyableField label={t("result.adminId")} value={result.admin_id} />
        <CopyableField
          label={t("result.adminPassword")}
          value={result.admin_password}
        />
        <CopyableField label={t("result.apiEndpoint")} value={result.api_endpoint} />
        <CopyableField label={t("result.key")} value={result.key} />
        <CopyableField
          label={t("result.callbackKey")}
          value={result.callback_key}
        />
      </SimpleGrid>

      <Box
        bg="var(--mantine-color-yellow-0)"
        p="md"
        mt="md"
        style={{ borderRadius: "var(--mantine-radius-sm)" }}
      >
        <Text size="sm" c="var(--mantine-color-yellow-9)" fw={500}>
          {t("result.securityWarning")}
        </Text>
      </Box>
    </Card>
  );
}