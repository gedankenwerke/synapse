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
} from "@mantine/core";
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { SettlementResponse } from "@/services/settlement/types";

function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface SettlementResultProps {
  result: SettlementResponse;
}

export function SettlementResult({ result }: SettlementResultProps) {
  const t = useTranslations("settlement");
  const tb = useTranslations("bank");

  const isSuccess =
    result.status === "success" || result.status === "Success";

  return (
    <Card
      withBorder
      shadow="sm"
      padding="lg"
      radius="md"
      style={{
        borderColor: isSuccess
          ? "var(--mantine-color-green-4)"
          : "var(--mantine-color-red-4)",
      }}
    >
      <Group gap="sm" mb="md">
        {isSuccess ? (
          <IconCheck size={20} color="var(--mantine-color-green-6)" />
        ) : (
          <IconAlertTriangle size={20} color="var(--mantine-color-red-6)" />
        )}
        <Text fw={600}>
          {isSuccess ? t("result.successTitle") : t("result.failedTitle")}
        </Text>
        <Badge color={isSuccess ? "green" : "red"} variant="light">
          {result.status}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" mb="sm">
        {result.message}
      </Text>

      <Divider my="sm" />

      <SimpleGrid cols={2}>
        <div>
          <Text size="sm" c="dimmed">
            {t("result.transactionId")}
          </Text>
          <Text size="sm" fw={500}>
            {result.result.id}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {t("result.date")}
          </Text>
          <Text size="sm" fw={500}>
            {result.result.date}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {t("result.bankStatus")}
          </Text>
          <Text size="sm" fw={500}>
            {result.result.bankstatus}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {t("result.accountName")}
          </Text>
          <Text size="sm" fw={500}>
            {result.result.tacctname}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {t("result.accountBank")}
          </Text>
          <Text size="sm" fw={500}>
            {result.result.tacctbank}
          </Text>
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {t("result.accountNo")}
          </Text>
          <Text size="sm" fw={500}>
            {result.result.tacctno}
          </Text>
        </div>
      </SimpleGrid>

      <Box
        bg={isSuccess ? "var(--mantine-color-green-0)" : "var(--mantine-color-red-0)"}
        p="md"
        mt="md"
        style={{ borderRadius: "var(--mantine-radius-sm)" }}
      >
        <Text size="sm" c="dimmed" mb={4}>
          {t("result.amount")}
        </Text>
        <Text
          fz="xl"
          fw={700}
          c={isSuccess ? "var(--mantine-color-green-7)" : "var(--mantine-color-red-7)"}
        >
          {formatBaht(result.result.amount)}
        </Text>
      </Box>
    </Card>
  );
}