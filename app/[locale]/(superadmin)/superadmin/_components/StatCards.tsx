"use client";

import { SimpleGrid, Paper, Text, Group, ThemeIcon, Skeleton } from "@mantine/core";
import {
  IconWallet,
  IconArrowDown,
  IconArrowUp,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { DashboardStatCard } from "@/services/dashboard/types";

const ICON_MAP = {
  wallet: IconWallet,
  deposit: IconArrowDown,
  withdrawal: IconArrowUp,
  users: IconUsers,
} as const;

interface StatCardsProps {
  statCards: DashboardStatCard[];
  isLoading?: boolean;
}

export function StatCards({ statCards, isLoading }: StatCardsProps) {
  const t = useTranslations("dashboard");

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Paper key={i} shadow="sm" p="md" radius="md">
            <Group justify="space-between" mb="xs">
              <Skeleton height={12} width={80} />
              <Skeleton height={24} width={24} radius="xl" />
            </Group>
            <Skeleton height={24} width={120} mt="sm" />
            <Skeleton height={12} width={140} mt="sm" />
          </Paper>
        ))}
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {statCards.map((card) => {
        const Icon = ICON_MAP[card.icon as keyof typeof ICON_MAP];
        const hasChange = card.change !== null;
        const isPositive = card.change !== null && card.change >= 0;
        return (
          <Paper key={card.titleKey} shadow="sm" p="md" radius="md">
            <Group justify="space-between" mb="xs">
              <Text size="sm" c="dimmed">
                {t(`stats.${card.titleKey}`)}
              </Text>
              <ThemeIcon variant="light" size="sm" color="orange">
                <Icon size={16} />
              </ThemeIcon>
            </Group>
            <Text fw={700} fz="xl">
              {card.value}
            </Text>
            <Group gap={4} mt={4}>
              {hasChange ? (
                <>
                  {isPositive ? (
                    <IconTrendingUp size={14} color="var(--mantine-color-green-6)" />
                  ) : (
                    <IconTrendingDown size={14} color="var(--mantine-color-red-6)" />
                  )}
                  <Text size="xs" c={isPositive ? "green" : "red"}>
                    {isPositive ? "+" : ""}
                    {card.change}% {t("stats.fromLastWeek")}
                  </Text>
                </>
              ) : (
                <Text size="xs" c="dimmed">
                  — {t("stats.fromLastWeek")}
                </Text>
              )}
            </Group>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}