"use client";

import {
  Card,
  Button,
  Group,
  SimpleGrid,
  TextInput,
  PasswordInput,
  Stack,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPlus } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export interface PayAgentFormValues {
  clientidadd: string;
  parentclient: string;
  secret: string;
  aglevel: string;
}

const defaultFormValues: PayAgentFormValues = {
  clientidadd: "",
  parentclient: "",
  secret: "",
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
      secret: (val: string) =>
        val.trim().length > 0 ? null : t("validation.secretRequired"),
    },
  });

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
          <SimpleGrid cols={2}>
            <PasswordInput
              label={t("form.secretLabel")}
              placeholder={t("form.secretPlaceholder")}
              {...form.getInputProps("secret")}
            />
            <TextInput
              label={t("form.aglevelLabel")}
              placeholder={t("form.aglevelPlaceholder")}
              {...form.getInputProps("aglevel")}
            />
          </SimpleGrid>
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