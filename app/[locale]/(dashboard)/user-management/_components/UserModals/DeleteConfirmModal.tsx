"use client";

import { useTranslations } from "next-intl";
import { Modal, Text, Group, Button } from "@mantine/core";

interface DeleteConfirmModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  loading?: boolean;
}

export function DeleteConfirmModal({
  opened,
  onClose,
  onConfirm,
  userName,
  loading,
}: DeleteConfirmModalProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.deleteTitle")} centered size="sm">
      <Text>
        {t("modal.deleteConfirmation", { userName })}
      </Text>
      <Group justify="flex-end" mt="xl">
        <Button variant="default" onClick={onClose} disabled={loading}>
          {tc("cancel")}
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          {tc("confirm")}
        </Button>
      </Group>
    </Modal>
  );
}