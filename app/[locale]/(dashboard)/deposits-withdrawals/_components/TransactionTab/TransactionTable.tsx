"use client";

import { useEffect, useCallback, useRef } from "react";
import {
  ActionIcon,
  Badge,
  Group,
  Loader,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconEye, IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { getColumns } from "./columns";
import type { TransactionItem } from "@/services/transaction/types";
import { DWS_STATUS_MAP } from "@/services/transaction/types";
import { formatBaht, formatDateTime, getUserDisplay } from "./utils";

interface TransactionTableProps {
  data: TransactionItem[];
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onView: (item: TransactionItem) => void;
  newItemIds: Set<string>;
}

function getItemKey(item: TransactionItem) {
  return `${item.dpwd_trans_id}-${item.acct_id}`;
}

function TypeBadge({ type }: { type: TransactionItem["trans_type"] }) {
  const ts = useTranslations("type");
  if (type === "Deposit") {
    return (
      <Badge variant="light" color="green" leftSection={<IconArrowDown size={12} />}>
        {ts("deposit")}
      </Badge>
    );
  }
  return (
    <Badge variant="light" color="red" leftSection={<IconArrowUp size={12} />}>
      {ts("withdraw")}
    </Badge>
  );
}

function StatusBadge({ dws }: { dws: number }) {
  const tstatus = useTranslations("status");
  const info = DWS_STATUS_MAP[dws];
  const label = info
    ? dws === 3
      ? tstatus("success")
      : tstatus("pending")
    : String(dws);
  const color = info?.color ?? "gray";
  return (
    <Badge variant="light" color={color}>
      {label}
    </Badge>
  );
}

export function TransactionTable({
  data,
  onLoadMore,
  hasMore,
  loadingMore,
  onView,
  newItemIds,
}: TransactionTableProps) {
  const t = useTranslations("transaction");
  const tc = useTranslations("common");
  const ts = useTranslations("type");
  const columns = getColumns(t);

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 });

  const wasLoadingMoreRef = useRef(false);
  useEffect(() => {
    wasLoadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  const triggerLoadMore = useCallback(() => {
    if (inView && hasMore && !loadingMore) {
      onLoadMore();
    }
  }, [inView, hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    triggerLoadMore();
  }, [triggerLoadMore]);

  return (
    <ScrollArea>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            {columns.map((col) => (
              <Table.Th key={col.key}>
                <Text size="sm" fw={500}>
                  {col.label}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.length === 0 && !loadingMore ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length}>
                <Text ta="center" c="dimmed" py="md">
                  {t("emptyState")}
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            <>
              <AnimatePresence>
                {data.map((item) => {
                  const key = getItemKey(item);
                  const shouldAnimate = newItemIds.has(key) && !wasLoadingMoreRef.current;
                  return (
                    <motion.tr
                      key={key}
                      {...(shouldAnimate ? {
                        initial: { opacity: 0, y: -20, scale: 0.95 },
                        animate: { opacity: 1, y: 0, scale: 1 },
                        transition: { duration: 0.3, ease: "easeOut" as const },
                      } : {
                        initial: false,
                        animate: { opacity: 1, y: 0, scale: 1 },
                        transition: { duration: 0.3 },
                      })}
                    >
                      <Table.Td>{item.dpwd_trans_id}</Table.Td>
                      <Table.Td>{formatDateTime(item.create_date)}</Table.Td>
                      <Table.Td>{getUserDisplay(item)}</Table.Td>
                      <Table.Td>
                        <TypeBadge type={item.trans_type} />
                      </Table.Td>
                      <Table.Td>
                        <Text c={item.trans_type === "Deposit" ? "green" : "red"} fw={500}>
                          {item.trans_type === "Deposit" ? "+" : "-"}
                          {formatBaht(item.dp_wd_amt)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <StatusBadge dws={item.dws} />
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label={tc("viewDetails")}>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => onView(item)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Table.Td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              <Table.Tr ref={sentinelRef} style={{ height: 1 }}>
                <Table.Td colSpan={columns.length}>
                  {loadingMore && (
                    <Group justify="center" py="sm">
                      <Loader size="sm" />
                    </Group>
                  )}
                </Table.Td>
              </Table.Tr>
            </>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}