"use client";

import { Container, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { StatCards } from "./_components/StatCards";
import { DashboardCharts } from "./_components/DashboardCharts";
import { RecentTable } from "./_components/RecentTable";
import { useDashboardData } from "./hooks/useDashboardData";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { statCards, areaChartData, donutChartData, recentTransactions, isLoading } = useDashboardData();

  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        <Text fz="xl" fw={700}>
          {t("title")}
        </Text>
        <StatCards statCards={statCards} isLoading={isLoading} />
        <DashboardCharts areaData={areaChartData} donutData={donutChartData} isLoading={isLoading} />
        <RecentTable transactions={recentTransactions} isLoading={isLoading} />
      </Stack>
    </Container>
  );
}