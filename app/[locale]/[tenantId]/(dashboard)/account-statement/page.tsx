"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Container, Group, Loader, Center, Stack, Text, Transition } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { usePageGuard } from "@/hooks/usePageGuard";
import type { BankStatementItem } from "@/services/account-statement/types";
import { StatementToolbar } from "./_components/StatementTab/StatementToolbar";
import { StatementTable } from "./_components/StatementTab/StatementTable";
import { StatementDetailModal } from "./_components/StatementTab/StatementModals";
import { useStatementQuery } from "./hooks/useStatementQuery";
import { useNewItems } from "./hooks/useNewItems";
import { formatStartDateTime, formatEndDateTime } from "@/utils/formatDateRange";

function getItemKey(item: BankStatementItem) {
  return `${item.acct_id}-${item.trno}-${item.trans_date}`;
}

export default function AccountStatementPage() {
  const t = useTranslations("accountStatement");
  const tc = useTranslations("common");
  const { allowed, loading } = usePageGuard("SearchBankStatement");
  if (loading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;

  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<BankStatementItem | null>(null);
  const notifiedRef = useRef(false);

  const startDateTime = startDate ? formatStartDateTime(startDate) : "";
  const endDateTime = endDate ? formatEndDateTime(endDate) : "";

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useStatementQuery(activeSearch, startDateTime, endDateTime);

  const items = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const { newItemIds } = useNewItems(items, getItemKey);

  const refreshing = isFetching && !isLoading;
  const loadingMore = isFetchingNextPage;
  const hasMore = hasNextPage ?? false;

  // Show error notification once per error occurrence
  useEffect(() => {
    if (error && !data && !notifiedRef.current) {
      const isSearch = activeSearch.trim().length > 0;
      notifications.show({
        title: isSearch ? tc("searchError") : tc("error"),
        message: isSearch ? t("error.searchFailed") : t("error.loadFailed"),
        color: "red",
      });
      notifiedRef.current = true;
    }
    if (!error) {
      notifiedRef.current = false;
    }
  }, [error, data, activeSearch, t, tc]);

  const handleSearch = () => {
    setActiveSearch(searchInput.trim());
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      fetchNextPage();
    }
  };

  const handleView = (item: BankStatementItem) => {
    setSelectedItem(item);
    openDetail();
  };

  const handleExport = () => {
    notifications.show({
      title: tc("export"),
      message: t("exportComingSoon"),
      color: "blue",
    });
  };

  if (isLoading && items.length === 0) {
    return (
      <Container size="xl" py="md">
        <Text fz="xl" fw={700} mb="md">{t("title")}</Text>
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Text fz="xl" fw={700} mb="md">
        {t("title")}
      </Text>

      <Stack gap="md">
        <div style={{ position: "relative" }}>
          <Transition mounted={refreshing} transition="fade" duration={200}>
            {(styles) => (
              <div
                style={{
                  ...styles,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: "linear-gradient(90deg, transparent, var(--mantine-color-blue-5), transparent)",
                  animation: "refreshSlide 1.5s ease-in-out infinite",
                  zIndex: 10,
                  borderRadius: 2,
                }}
              />
            )}
          </Transition>
          <style>{`
            @keyframes refreshSlide {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(0%); }
              100% { transform: translateX(100%); }
            }
          `}</style>
        <StatementToolbar
          searchValue={searchInput}
          onSearchValueChange={setSearchInput}
          onSearch={handleSearch}
          startDate={startDate}
          onStartChange={(date) => setStartDate(date ?? new Date())}
          endDate={endDate}
          onEndChange={(date) => setEndDate(date ?? new Date())}
          onExport={handleExport}
        />

        <StatementTable
          data={items}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
          onView={handleView}
          newItemIds={newItemIds}
        />
        </div>
      </Stack>

      <StatementDetailModal
        opened={detailOpened}
        onClose={closeDetail}
        item={selectedItem}
      />
    </Container>
  );
}