"use client";

import { useRef, useState, useEffect } from "react";
import { SimpleGrid, Paper, Text, Skeleton } from "@mantine/core";
import { AreaChart, DonutChart } from "@mantine/charts";
import { useTranslations } from "next-intl";
import type { DashboardAreaDatum, DashboardDonutDatum } from "@/services/dashboard/types";

interface DashboardChartsProps {
  areaData: DashboardAreaDatum[];
  donutData: DashboardDonutDatum[];
  isLoading?: boolean;
}

function useContainerReady() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.offsetWidth > 0) {
      setReady(true);
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) {
        setReady(true);
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, ready };
}

export function DashboardCharts({ areaData, donutData, isLoading }: DashboardChartsProps) {
  const t = useTranslations("dashboard");
  const { ref, ready } = useContainerReady();

  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, md: 3 }}>
        <Paper shadow="sm" p="md" radius="md" style={{ gridColumn: "span 2 / span 2" }}>
          <Skeleton height={20} width="50%" mb="sm" />
          <Skeleton height={300} />
        </Paper>
        <Paper shadow="sm" p="md" radius="md">
          <Skeleton height={20} width="60%" mb="sm" />
          <Skeleton height={220} />
        </Paper>
      </SimpleGrid>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, md: 3 }}>
      <Paper ref={ref} shadow="sm" p="md" radius="md" style={{ gridColumn: "span 2 / span 2" }}>
        <Text fw={600} mb="sm">
          {t("charts.depositVsWithdrawal")}
        </Text>
        {areaData.length === 0 ? (
          <Text c="dimmed" ta="center" py="lg">
            No data
          </Text>
        ) : (
          ready && (
            <AreaChart
              h={300}
              data={areaData}
              series={[
                { name: "Deposits", color: "orange.6" },
                { name: "Withdrawals", color: "gray.6" },
              ]}
              dataKey="date"
              type="default"
              curveType="monotone"
              withGradient
              withDots
              strokeWidth={2}
              fillOpacity={0.2}
            />
          )
        )}
      </Paper>
      <Paper shadow="sm" p="md" radius="md">
        <Text fw={600} mb="sm">
          {t("charts.transactionStatus")}
        </Text>
        {donutData.length === 0 ? (
          <Text c="dimmed" ta="center" py="lg">
            No data
          </Text>
        ) : (
          <DonutChart
            data={donutData}
            size={220}
            thickness={20}
            withLabels
            labelsType="percent"
            withTooltip
          />
        )}
      </Paper>
    </SimpleGrid>
  );
}