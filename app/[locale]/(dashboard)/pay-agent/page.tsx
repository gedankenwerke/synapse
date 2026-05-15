"use client";

import { useState, useRef } from "react";
import { Container, Stack, Text, Transition } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { payAgent } from "@/services/pay-agent";
import type { PayAgentResponse } from "@/services/pay-agent.types";
import { PayAgentForm } from "./_components/PayAgentTab/PayAgentForm";
import { PayAgentResult } from "./_components/PayAgentTab/PayAgentResult";

export default function PayAgentPage() {
  const t = useTranslations("payAgent");
  const tc = useTranslations("common");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PayAgentResponse | null>(null);
  const notifiedRef = useRef(false);

  const handleSubmit = async (values: {
    clientidadd: string;
    parentclient: string;
    secret: string;
    aglevel: string;
  }) => {
    setLoading(true);
    setResult(null);
    notifiedRef.current = false;

    try {
      const response = await payAgent.create({
        clientidadd: values.clientidadd,
        parentclient: values.parentclient,
        secret: values.secret,
        aglevel: values.aglevel || undefined,
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