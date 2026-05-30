"use client";

import {
  Card,
  Button,
  Group,
  SimpleGrid,
  TextInput,
  Select,
  NumberInput,
  Textarea,
  Stack,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSend } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { BANK_OPTIONS } from "./mockData";

export interface SettlementFormValues {
  clientid: string;
  userid: string;
  acctbank: string;
  acctno: string;
  amount: number;
  settlement: number;
  ip: string;
  remark: string;
}

const defaultFormValues: SettlementFormValues = {
  clientid: "",
  userid: "",
  acctbank: "",
  acctno: "",
  amount: 0,
  settlement: 1,
  ip: "",
  remark: "",
};

interface SettlementFormProps {
  onSubmit: (values: SettlementFormValues) => void;
  loading: boolean;
}

export function SettlementForm({ onSubmit, loading }: SettlementFormProps) {
  const t = useTranslations("settlement");
  const tc = useTranslations("common");
  const tb = useTranslations("bank");

  const form = useForm<SettlementFormValues>({
    initialValues: { ...defaultFormValues },
    validate: {
      clientid: (val: string) =>
        val.trim().length > 0 ? null : t("validation.clientidRequired"),
      userid: (val: string) =>
        val.trim().length > 0 ? null : t("validation.useridRequired"),
      acctbank: (val: string) =>
        val.trim().length > 0 ? null : t("validation.bankTypeRequired"),
      acctno: (val: string) =>
        val.trim().length > 0 ? null : t("validation.accountNumberRequired"),
      amount: (val: number) =>
        val > 0 ? null : t("validation.amountGreaterThanZero"),
    },
  });

  const bankData = BANK_OPTIONS.map((bank) => ({
    value: bank,
    label: tb(bank.toLowerCase()),
  }));

  const settlementTypeData = [
    { value: "1", label: t("settlementType.withdraw") },
    { value: "0", label: t("settlementType.deposit") },
  ];

  const handleSubmit = (values: SettlementFormValues) => {
    onSubmit(values);
  };

  return (
    <Card withBorder shadow="sm" padding="lg" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <SimpleGrid cols={2}>
            <TextInput
              label={t("form.clientidLabel")}
              placeholder={t("form.clientidPlaceholder")}
              {...form.getInputProps("clientid")}
            />
            <TextInput
              label={t("form.useridLabel")}
              placeholder={t("form.useridPlaceholder")}
              {...form.getInputProps("userid")}
            />
            <Select
              label={t("modal.bankTypeLabel")}
              placeholder={t("modal.bankTypePlaceholder")}
              data={bankData}
              {...form.getInputProps("acctbank")}
            />
            <TextInput
              label={t("modal.accountNumberLabel")}
              placeholder={t("modal.accountNumberPlaceholder")}
              {...form.getInputProps("acctno")}
            />
            <NumberInput
              label={t("modal.amountLabel")}
              placeholder={t("modal.amountPlaceholder")}
              min={0}
              step={1}
              thousandSeparator
              allowDecimal={false}
              {...form.getInputProps("amount")}
            />
            <Select
              label={t("form.settlementTypeLabel")}
              placeholder={t("form.settlementTypePlaceholder")}
              data={settlementTypeData}
              {...form.getInputProps("settlement")}
            />
          </SimpleGrid>
          <SimpleGrid cols={2}>
            <TextInput
              label={t("form.ipLabel")}
              placeholder={t("form.ipPlaceholder")}
              {...form.getInputProps("ip")}
            />
          </SimpleGrid>
          <Textarea
            label={t("modal.remarkLabel")}
            placeholder={t("modal.remarkPlaceholder")}
            {...form.getInputProps("remark")}
          />
          <Group justify="flex-end" mt="md">
            <Button
              type="submit"
              leftSection={
                loading ? (
                  <Loader size={16} color="white" />
                ) : (
                  <IconSend size={16} />
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