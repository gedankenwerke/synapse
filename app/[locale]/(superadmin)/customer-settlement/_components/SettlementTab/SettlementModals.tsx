"use client";

import {
  Modal,
  Button,
  Group,
  Text,
  Stack,
  SimpleGrid,
  Divider,
  Box,
  TextInput,
  Select,
  NumberInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import type { SettlementData } from "./mockData";
import { formatBaht, formatDate, formatBankDetails, BANK_OPTIONS } from "./mockData";

export interface SettlementFormValues {
  userName: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  remark: string;
}

const defaultFormValues: SettlementFormValues = {
  userName: "",
  bankName: "",
  accountNumber: "",
  amount: 0,
  remark: "",
};

interface AddSettlementModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: SettlementFormValues) => void;
}

export function AddSettlementModal({ opened, onClose, onSave }: AddSettlementModalProps) {
  const t = useTranslations("settlement");
  const tc = useTranslations("common");
  const tb = useTranslations("bank");

  const form = useForm<SettlementFormValues>({
    initialValues: { ...defaultFormValues },
    validate: {
      userName: (val: string) => (val.trim().length > 0 ? null : t("validation.userNameRequired")),
      bankName: (val: string) => (val.trim().length > 0 ? null : t("validation.bankTypeRequired")),
      accountNumber: (val: string) => (val.trim().length > 0 ? null : t("validation.accountNumberRequired")),
      amount: (val: number) => (val > 0 ? null : t("validation.amountGreaterThanZero")),
    },
  });

  const bankData = BANK_OPTIONS.map((bank) => ({
    value: bank,
    label: tb(bank.toLowerCase()),
  }));

  const handleSubmit = (values: SettlementFormValues) => {
    onSave(values);
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.addTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2}>
          <TextInput
            label={t("modal.userNameLabel")}
            placeholder={t("modal.userNamePlaceholder")}
            {...form.getInputProps("userName")}
          />
          <Select
            label={t("modal.bankTypeLabel")}
            placeholder={t("modal.bankTypePlaceholder")}
            data={bankData}
            {...form.getInputProps("bankName")}
          />
          <TextInput
            label={t("modal.accountNumberLabel")}
            placeholder={t("modal.accountNumberPlaceholder")}
            {...form.getInputProps("accountNumber")}
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
        </SimpleGrid>
        <Textarea
          label={t("modal.remarkLabel")}
          placeholder={t("modal.remarkPlaceholder")}
          mt="md"
          {...form.getInputProps("remark")}
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button type="submit">{t("modal.addSettlement")}</Button>
        </Group>
      </form>
    </Modal>
  );
}

interface ProcessTransferModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  settlement: SettlementData | null;
}

export function ProcessTransferModal({
  opened,
  onClose,
  onConfirm,
  settlement,
}: ProcessTransferModalProps) {
  const t = useTranslations("settlement");
  const tc = useTranslations("common");
  const tb = useTranslations("bank");

  if (!settlement) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.processPayoutTitle")} centered size="md">
      <Stack gap="md">
        <SimpleGrid cols={2}>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.settlementId")}
            </Text>
            <Text size="sm" fw={500}>
              {settlement.id}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.requestDate")}
            </Text>
            <Text size="sm" fw={500}>
              {formatDate(settlement.requestDate)}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.user")}
            </Text>
            <Text size="sm" fw={500}>
              {settlement.userName}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.bankDetails")}
            </Text>
            <Text size="sm" fw={500}>
              {formatBankDetails(tb(settlement.bankName.toLowerCase()), settlement.accountNumber)}
            </Text>
          </div>
        </SimpleGrid>

        <Divider />

        <Box bg="var(--mantine-color-orange-0)" p="md" style={{ borderRadius: "var(--mantine-radius-sm)" }}>
          <Text size="sm" c="dimmed" mb={4}>
            {t("modal.amountToTransfer")}
          </Text>
          <Text fz="xl" fw={700} c="var(--mantine-color-orange-7)">
            {formatBaht(settlement.amount)}
          </Text>
        </Box>

        <Divider />

        <div>
          <Text size="sm" fw={500} mb={8}>
            {t("modal.uploadSlipLabel")}
          </Text>
          <Dropzone
            onDrop={() => {}}
            onReject={() => {}}
            maxSize={5 * 1024 * 1024}
            accept={["image/*"]}
          >
            <Group justify="center" gap="xl" mih={100} style={{ pointerEvents: "none" }}>
              <Dropzone.Idle>
                <IconUpload size={32} stroke={1.5} color="var(--mantine-color-dimmed)" />
              </Dropzone.Idle>
              <div>
                <Text size="sm" ta="center" inline>
                  {tc("dropzone.dragOrClick")}
                </Text>
                <Text size="xs" c="dimmed" mt={4} ta="center" inline>
                  {tc("dropzone.fileHint")}
                </Text>
              </div>
            </Group>
          </Dropzone>
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button onClick={onConfirm}>
            {t("modal.confirmTransfer")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

interface ViewDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  settlement: SettlementData | null;
}

export function ViewDetailsModal({
  opened,
  onClose,
  settlement,
}: ViewDetailsModalProps) {
  const t = useTranslations("settlement");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const tb = useTranslations("bank");

  if (!settlement) return null;

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.detailsTitle")} centered size="md">
      <Stack gap="md">
        <SimpleGrid cols={2}>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.settlementId")}
            </Text>
            <Text size="sm" fw={500}>
              {settlement.id}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.requestDate")}
            </Text>
            <Text size="sm" fw={500}>
              {formatDate(settlement.requestDate)}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.user")}
            </Text>
            <Text size="sm" fw={500}>
              {settlement.userName}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.bankDetails")}
            </Text>
            <Text size="sm" fw={500}>
              {formatBankDetails(tb(settlement.bankName.toLowerCase()), settlement.accountNumber)}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.amount")}
            </Text>
            <Text size="sm" fw={700}>
              {formatBaht(settlement.amount)}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              {t("modal.status")}
            </Text>
            <Text size="sm" fw={500}>
              {ts(settlement.status.toLowerCase())}
            </Text>
          </div>
        </SimpleGrid>

        <Divider />

        <div>
          <Text size="sm" fw={500} mb={8}>
            {t("modal.transferSlip")}
          </Text>
          <Box
            bg="var(--mantine-color-gray-1)"
            p="xl"
            style={{
              borderRadius: "var(--mantine-radius-sm)",
              textAlign: "center",
            }}
          >
            <IconPhoto size={48} stroke={1} color="var(--mantine-color-dimmed)" />
            <Text size="sm" c="dimmed" mt="sm">
              {t("modal.transferSlip")}
            </Text>
          </Box>
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            {tc("close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}