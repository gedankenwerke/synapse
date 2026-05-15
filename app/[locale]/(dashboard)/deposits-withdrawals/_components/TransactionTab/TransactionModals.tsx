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
import type { TransactionItem } from "@/services/transaction/types";
import { DWS_STATUS_MAP } from "@/services/transaction/types";
import { formatBaht, formatDateTime, displayOrNA, formatBankName } from "./utils";

interface TransactionDetailModalProps {
  opened: boolean;
  onClose: () => void;
  item: TransactionItem | null;
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

function TypeBadge({ type }: { type: TransactionItem["trans_type"] }) {
  const ts = useTranslations("type");
  return (
    <Badge variant="light" color={type === "Deposit" ? "green" : "red"}>
      {type === "Deposit" ? ts("deposit") : ts("withdraw")}
    </Badge>
  );
}

export function TransactionDetailModal({
  opened,
  onClose,
  item,
}: TransactionDetailModalProps) {
  const t = useTranslations("transaction");
  const tc = useTranslations("common");
  const tstatus = useTranslations("status");
  const tb = useTranslations("bank");

  if (!item) return null;

  const statusInfo = DWS_STATUS_MAP[item.dws];
  const statusLabel = statusInfo
    ? item.dws === 3
      ? tstatus("success")
      : tstatus("pending")
    : String(item.dws);
  const statusColor = statusInfo?.color ?? "gray";

  return (
    <Modal opened={opened} onClose={onClose} size="lg" centered title={t("modal.title")}>
      <Stack gap="sm">
        <SimpleGrid cols={2}>
          <DetailRow label={t("modal.transId")}>
            <Text size="sm" fw={500}>{item.dpwd_trans_id}</Text>
          </DetailRow>
          <DetailRow label={t("modal.dateTime")}>
            <Text size="sm" fw={500}>{formatDateTime(item.create_date)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.user")}>
            <Text size="sm" fw={500}>{displayOrNA(item.u_client_id, tc)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.userId")}>
            <Text size="sm" fw={500}>{displayOrNA(item.user_id, tc)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.type")}>
            <TypeBadge type={item.trans_type} />
          </DetailRow>
          <DetailRow label={t("modal.amount")}>
            <Text size="sm" fw={500} c={item.trans_type === "Deposit" ? "green" : "red"}>
              {item.trans_type === "Deposit" ? "+" : "-"}
              {formatBaht(item.dp_wd_amt)}
            </Text>
          </DetailRow>
          <DetailRow label={t("modal.status")}>
            <Badge variant="light" color={statusColor}>
              {statusLabel}
            </Badge>
          </DetailRow>
          <DetailRow label={t("modal.clientStatus")}>
            <Text size="sm" fw={500}>{item.cs}</Text>
          </DetailRow>
          <DetailRow label={t("modal.accountId")}>
            <Text size="sm" fw={500}>{item.acct_id}</Text>
          </DetailRow>
          <DetailRow label={t("modal.reqTransId")}>
            <Text size="sm" fw={500}>{item.req_trans_id}</Text>
          </DetailRow>
          <DetailRow label={t("modal.bank")}>
            <Text size="sm" fw={500}>{formatBankName(item.t_acct_bank, tb)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.accountNo")}>
            <Text size="sm" fw={500}>{displayOrNA(item.t_acct_no, tc)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.sendId")}>
            <Text size="sm" fw={500}>{item.send_id}</Text>
          </DetailRow>
          <DetailRow label={t("modal.sendStatus")}>
            <Text size="sm" fw={500}>{displayOrNA(item.send_status, tc)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.resStatus")}>
            <Text size="sm" fw={500}>{displayOrNA(item.res_status, tc)}</Text>
          </DetailRow>
          <DetailRow label={t("modal.remark")}>
            <Text size="sm" fw={500}>{displayOrNA(item.remark2, tc)}</Text>
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