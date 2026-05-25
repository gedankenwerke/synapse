"use client";

import { Container, Stack, Text, Loader, Center } from "@mantine/core";
import { useTranslations } from "next-intl";
import { usePageGuard } from "@/hooks/usePageGuard";
import { StatCards } from "@/app/[locale]/(superadmin)/superadmin/_components/StatCards";
import { DashboardCharts } from "@/app/[locale]/(superadmin)/superadmin/_components/DashboardCharts";
import { RecentTable } from "@/app/[locale]/(superadmin)/superadmin/_components/RecentTable";
import { useDashboardData } from "@/app/[locale]/(superadmin)/superadmin/hooks/useDashboardData";

export default function SeniorDashboardPage() {
  const t = useTranslations("superadmin");
  const { allowed, loading } = usePageGuard("SearchTransactionHistory");
  if (loading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;

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