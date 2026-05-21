"use client";

import {
  Card,
  Button,
  Group,
  SimpleGrid,
  TextInput,
  Select,
  Stack,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { AG_LEVELS } from "@/services/pay-agent/types";
import type { AGLevel } from "@/services/pay-agent/types";

export interface PayAgentFormValues {
  clientidadd: string;
  parentclient: string;
  aglevel: AGLevel | "";
}

const defaultFormValues: PayAgentFormValues = {
  clientidadd: "",
  parentclient: "",
  aglevel: "",
};

interface PayAgentFormProps {
  onSubmit: (values: PayAgentFormValues) => void;
  loading: boolean;
}

export function PayAgentForm({ onSubmit, loading }: PayAgentFormProps) {
  const t = useTranslations("payAgent");
  const tc = useTranslations("common");

  const form = useForm<PayAgentFormValues>({
    initialValues: { ...defaultFormValues },
    validate: {
      clientidadd: (val: string) =>
        val.trim().length > 0 ? null : t("validation.clientidaddRequired"),
      parentclient: (val: string) =>
        val.trim().length > 0 ? null : t("validation.parentclientRequired"),
      aglevel: (val: string) =>
        val.trim().length > 0 ? null : t("validation.aglevelRequired"),
    },
  });

  const agLevelOptions = AG_LEVELS.map((level) => ({
    value: level,
    label: level,
  }));

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label={t("form.clientidaddLabel")}
              placeholder={t("form.clientidaddPlaceholder")}
              {...form.getInputProps("clientidadd")}
            />
            <TextInput
              label={t("form.parentclientLabel")}
              placeholder={t("form.parentclientPlaceholder")}
              {...form.getInputProps("parentclient")}
            />
          </SimpleGrid>
          <Select
            label={t("form.aglevelLabel")}
            placeholder={t("form.aglevelPlaceholder")}
            data={agLevelOptions}
            {...form.getInputProps("aglevel")}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              leftSection={
                loading ? (
                  <Loader size={16} color="white" />
                ) : (
                  <IconUserPlus size={16} />
                )
              }
              disabled={loading}
            >
              {loading ? t("form.processing") : t("form.submit")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}