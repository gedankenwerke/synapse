"use client";

import { useState, useRef } from "react";
import { Container, Stack, Text, Transition, Loader, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { usePageGuard } from "@/hooks/usePageGuard";
import { settlement } from "@/services/settlement";
import type { SettlementResponse } from "@/services/settlement/types";
import { SettlementForm } from "./_components/SettlementTab/SettlementForm";
import { SettlementResult } from "./_components/SettlementTab/SettlementResult";

export default function CustomerSettlementPage() {
  const t = useTranslations("settlement");
  const tc = useTranslations("common");
  const { allowed, loading: guardLoading } = usePageGuard("Settlement");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SettlementResponse | null>(null);
  const notifiedRef = useRef(false);

  const handleSubmit = async (values: {
    clientid: string;
    userid: string;
    acctbank: string;
    acctno: string;
    amount: number;
    settlement: number;
    ip: string;
    remark: string;
  }) => {
    setLoading(true);
    setResult(null);
    notifiedRef.current = false;

    try {
      const response = await settlement.create({
        clientid: values.clientid,
        userid: values.userid,
        acctbank: values.acctbank,
        acctno: values.acctno,
        amount: values.amount,
        settlement: values.settlement,
        ip: values.ip || undefined,
        remark: values.remark || undefined,
      });
      setResult(response);
      notifications.show({
        title: tc("success"),
        message: t("success.created"),
        color: "green",
      });
    } catch (error: any) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        notifications.show({
          title: tc("error"),
          message: error?.message || tc("somethingWentWrong"),
          color: "red",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (guardLoading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;

  return (
    <Container size="lg" py="xl">
      <Text fz="xl" fw={700} mb="md">
        {t("title")}
      </Text>

      <Stack gap="xl">
        <SettlementForm onSubmit={handleSubmit} loading={loading} />

        <Transition mounted={!!result} transition="slide-up" duration={300}>
          {(styles) =>
            result ? (
              <div style={styles}>
                <SettlementResult result={result} />
              </div>
            ) : (
              <div />
            )
          }
        </Transition>
      </Stack>
    </Container>
  );
}