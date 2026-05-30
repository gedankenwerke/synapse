"use client";

import {
  Badge,
  Button,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import type { BankStatementItem } from "@/services/account-statement/types";
import { STATUS_MAP } from "@/services/account-statement/types";
import { formatBaht, formatDateTime, formatBankName, displayOrNA } from "./utils";

interface StatementDetailModalProps {
  opened: boolean;
  onClose: () => void;
  item: BankStatementItem | null;
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Group justify="space-between">
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      {children}
    </Group>
  );
}

function TypeBadge({ type }: { type: BankStatementItem["trans_type"] }) {
  const typ = useTranslations("type");
  const typeKey = type === "Deposit" ? "deposit" : "withdraw";

  return (
    <Badge variant="light" color={type === "Deposit" ? "green" : "red"}>
      {typ(typeKey)}
    </Badge>
  );
}

export function StatementDetailModal({
  opened,
  onClose,
  item,
}: StatementDetailModalProps) {
  const t = useTranslations("accountStatement");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const tb = useTranslations("bank");

  if (!item) return null;

  const statusColor = STATUS_MAP[item.status]?.color ?? "gray";
  const statusLabel = item.status === 0
    ? ts("success")
    : item.status === 1
      ? ts("failed")
      : tc("unknown");

  return (
    <Modal opened={opened} onClose={onClose} size="lg" centered title={t("modal.title")}>
      <Stack gap="sm">
        <SimpleGrid cols={2}>
          <DetailRow label={t("modal.transactionId")}>
            <Text size="sm" fw={500}>{item.trno}</Text>
          </DetailRow>
          <DetailRow label={t("modal.dateTime")}>
            <Text size="sm" fw={500}>{formatDateTime(item.trans_date)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.type")}>
            <TypeBadge type={item.trans_type} />
          </DetailRow>
          <DetailRow label={t("modal.amount")}>
            <Text size="sm" fw={500} c={item.trans_type === "Deposit" ? "green" : "red"}>
              {item.trans_type === "Deposit" ? "+" : "-"}
              {formatBaht(item.amount)}
            </Text>
          </DetailRow>
          <DetailRow label={t("modal.availableBalance")}>
            <Text size="sm" fw={700}>{formatBaht(item.acct_avail)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.bank")}>
            <Text size="sm" fw={500}>{formatBankName(item.acct_bank, tb)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.accountNo")}>
            <Text size="sm" fw={500}>{displayOrNA(item.acct_no, tc("na"))}</Text>
          </DetailRow>
          <DetailRow label={t("modal.nameTh")}>
            <Text size="sm" fw={500}>{displayOrNA(item.name_th, tc("na"))}</Text>
          </DetailRow>
          <DetailRow label={t("modal.nameEn")}>
            <Text size="sm" fw={500}>{displayOrNA(item.name_en, tc("na"))}</Text>
          </DetailRow>
          <DetailRow label={t("modal.transactionName")}>
            <Text size="sm" fw={500}>{displayOrNA(item.trans_name, tc("na"))}</Text>
          </DetailRow>
          <DetailRow label={t("modal.channel")}>
            <Text size="sm" fw={500}>{displayOrNA(item.channel, tc("na"))}</Text>
          </DetailRow>
          <DetailRow label={t("modal.clientId")}>
            <Text size="sm" fw={500}>{displayOrNA(item.client_id, tc("na"))}</Text>
          </DetailRow>
          <DetailRow label={t("modal.reqTransId")}>
            <Text size="sm" fw={500}>{item.req_trans_id}</Text>
          </DetailRow>
          <DetailRow label={t("modal.status")}>
            <Badge variant="light" color={statusColor}>
              {statusLabel}
            </Badge>
          </DetailRow>
        </SimpleGrid>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            {tc("close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}