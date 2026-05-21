"use client";

import { useState, useRef } from "react";
import { Container, Stack, Text, Transition, Loader, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { usePageGuard } from "@/hooks/usePageGuard";
import { payAgent } from "@/services/pay-agent";
import type { PayAgentResponse, AGLevel } from "@/services/pay-agent/types";
import { PayAgentForm } from "./_components/PayAgentTab/PayAgentForm";
import { PayAgentResult } from "./_components/PayAgentTab/PayAgentResult";

export default function PayAgentPage() {
  const t = useTranslations("payAgent");
  const tc = useTranslations("common");
  const { allowed, loading: guardLoading } = usePageGuard("CreatePayAgent");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PayAgentResponse | null>(null);
  const notifiedRef = useRef(false);

  const handleSubmit = async (values: {
    clientidadd: string;
    parentclient: string;
    aglevel: string;
  }) => {
    setLoading(true);
    setResult(null);
    notifiedRef.current = false;

    try {
      const response = await payAgent.create({
        clientidadd: values.clientidadd,
        parentclient: values.parentclient,
        aglevel: values.aglevel as AGLevel,
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
        <PayAgentForm onSubmit={handleSubmit} loading={loading} />

        <Transition mounted={!!result} transition="slide-up" duration={300}>
          {(styles) =>
            result ? (
              <div style={styles}>
                <PayAgentResult result={result} />
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