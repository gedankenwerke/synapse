"use client";

import { useState, useEffect, useRef } from "react";
import {
  Badge,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { DonutChart } from "@mantine/charts";
import { IconArrowUpRight, IconArrowDownRight, IconCalendar } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import type { NetBalanceItem } from "@/services/net-balance/types";
import { useNetBalanceQuery } from "./hooks/useNetBalanceQuery";
import { formatBaht, formatCompact, formatDate, formatLastUpdated } from "./_components/utils";
import { formatStartDateTime, formatEndDateTime } from "@/utils/formatDateRange";

function AccountCard({ item }: { item: NetBalanceItem }) {
  const t = useTranslations("netBalance.card");
  const ts = useTranslations("status");

  const netBal = item.acct_deposit - item.acct_withdraw;
  const isPositive = netBal >= 0;

  const chartData = [
    { name: ts("completed"), value: item.acct_deposit, color: "orange.6" },
    { name: ts("pending"), value: item.acct_withdraw, color: "gray.4" },
  ];

  return (
    <Paper radius="lg" p="lg" withBorder shadow="sm">
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <div>
            <Text size="l" c="dimmed" fw={500}>{t("account")}</Text>
            <Text fw={900} fz="xl">#{item.acct_id}</Text>
          </div>
          <Badge variant="light" color="orange" size="sm">
            {formatDate(item.year_month_day)}
          </Badge>
        </Group>

        <Divider />

        <Stack align="center" gap={2}>
          <Text size="xs" tt="uppercase" c="dimmed" fw={600} lts={1.5}>
            {t("netBalance")}
          </Text>
          <Title order={3} fw={900} c={isPositive ? "teal" : "red"}>
            {isPositive ? "+" : ""}{formatBaht(netBal)}
          </Title>
        </Stack>

        <Group justify="center" wrap="nowrap" gap="md">
          <DonutChart
            data={chartData}
            size={100}
            thickness={14}
            tooltipDataSource="segment"
            styles={{ root: { display: "flex", justifyContent: "center" } }}
          />
          <Stack gap={6}>
            <Group gap="xs">
              <IconArrowUpRight size={14} color="var(--mantine-color-orange-6)" />
              <Text size="xs" c="dimmed" fw={500}>{t("deposit")}</Text>
            </Group>
            <Text fw={700} fz="sm" c="orange.7">
              {formatCompact(item.acct_deposit)}
            </Text>
            <Group gap="xs" mt={4}>
              <IconArrowDownRight size={14} color="var(--mantine-color-gray-5)" />
              <Text size="xs" c="dimmed" fw={500}>{t("withdrawal")}</Text>
            </Group>
            <Text fw={700} fz="sm" c="gray.6">
              {formatCompact(item.acct_withdraw)}
            </Text>
          </Stack>
        </Group>

        <Text size="xs" c="dimmed" ta="right">
          {t("updated")} {formatLastUpdated(item.update_date)}
        </Text>
      </Stack>
    </Paper>
  );
}

export default function NetBalancePage() {
  const t = useTranslations("netBalance");
  const tc = useTranslations("common");
  const notifiedRef = useRef(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const startDateTime = selectedDate ? formatStartDateTime(selectedDate) : "";
  const endDateTime = selectedDate ? formatEndDateTime(selectedDate) : "";

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useNetBalanceQuery(startDateTime, endDateTime);

  const items: NetBalanceItem[] = data?.items ?? [];
  const refreshing = isFetching && !isLoading;

  useEffect(() => {
    if (error && !data && !notifiedRef.current) {
      notifications.show({
        title: tc("error"),
        message: t("error.loadFailed"),
        color: "red",
      });
      notifiedRef.current = true;
    }
    if (!error) {
      notifiedRef.current = false;
    }
  }, [error, data, t, tc]);

  if (isLoading && items.length === 0) {
    return (
      <Container size="md" py="md">
        <Title order={2}>{t("title")}</Title>
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="md" py="md">
      <Stack gap="xs" mb="lg">
        <Title order={2}>{t("title")}</Title>
        <Text c="dimmed" size="sm">
          {t("subtitle")}
        </Text>
      </Stack>

      <div style={{ position: "relative" }}>
        <Transition mounted={refreshing} transition="fade" duration={200}>
          {(styles) => (
            <div
              style={{
                ...styles,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, transparent, var(--mantine-color-orange-5), transparent)",
                animation: "refreshSlide 1.5s ease-in-out infinite",
                zIndex: 10,
                borderRadius: 2,
              }}
            />
          )}
        </Transition>
        <style>{`
          @keyframes refreshSlide {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        <Group gap="sm" mb="lg">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mantine onChange type mismatch */}
          <DatePickerInput
            leftSection={<IconCalendar size={16} />}
            label={t("selectDate")}
            placeholder={t("selectDate")}
            value={selectedDate}
            onChange={((date: Date | null) => setSelectedDate(date ?? new Date())) as any}
            w={180}
            clearable
          />
        </Group>

        {items.length === 0 ? (
          <Text ta="center" c="dimmed" py="xl">
            {t("emptyState")}
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
            {items.map((item) => (
              <AccountCard key={item.acct_id} item={item} />
            ))}
          </SimpleGrid>
        )}
      </div>
    </Container>
  );
}