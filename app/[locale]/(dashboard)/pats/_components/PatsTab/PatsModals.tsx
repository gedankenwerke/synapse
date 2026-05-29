"use client";

import {
  Modal,
  Stack,
  TextInput,
  Group,
  Button,
  Text,
  Alert,
  Code,
  CopyButton,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTranslations } from "next-intl";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import type { Pat } from "@/services/pats/types";

interface CreatePatModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (values: { name: string }) => void;
  loading: boolean;
  createdPat?: Pat | null;
}

export function CreatePatModal({
  opened,
  onClose,
  onSubmit,
  loading,
  createdPat,
}: CreatePatModalProps) {
  const t = useTranslations("pats");
  const tc = useTranslations("common");

  const form = useForm({
    initialValues: { name: "" },
    validate: {
      name: (v) => (v.trim().length === 0 ? t("validation.nameRequired") : null),
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal opened={opened} onClose={handleClose} title={t("modals.createTitle")} centered>
      {createdPat?.token ? (
        <Stack gap="md">
          <Alert color="yellow" title={t("tokenWarning")}>
            {t("tokenWarningDetail")}
          </Alert>
          <Code block>{createdPat.token}</Code>
          <Group justify="flex-end">
            <CopyButton value={createdPat.token}>
              {({ copied, copy }) => (
                <Tooltip label={copied ? tc("copied") : tc("copy")}>
                  <Button
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    leftSection={
                      copied ? <IconCheck size={14} /> : <IconCopy size={14} />
                    }
                  >
                    {copied ? tc("copied") : tc("copyToken")}
                  </Button>
                </Tooltip>
              )}
            </CopyButton>
            <Button variant="default" onClick={handleClose}>
              {tc("close")}
            </Button>
          </Group>
        </Stack>
      ) : (
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Stack gap="md">
            <TextInput
              label={t("columns.name")}
              placeholder={t("modals.namePlaceholder")}
              {...form.getInputProps("name")}
            />
            <Group justify="flex-end">
              <Button variant="default" onClick={handleClose}>
                {tc("cancel")}
              </Button>
              <Button type="submit" loading={loading}>
                {tc("create")}
              </Button>
            </Group>
          </Stack>
        </form>
      )}
    </Modal>
  );
}

interface DeletePatModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  patName: string;
}

export function DeletePatModal({
  opened,
  onClose,
  onConfirm,
  loading,
  patName,
}: DeletePatModalProps) {
  const t = useTranslations("pats");
  const tc = useTranslations("common");

  return (
    <Modal opened={opened} onClose={onClose} title={t("modals.deleteTitle")} centered size="sm">
      <Stack gap="md">
        <Text size="sm">
          {t("modals.deleteConfirm", { name: patName })}
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            {tc("cancel")}
          </Button>
          <Button color="red" onClick={onConfirm} loading={loading}>
            {tc("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}