"use client";

import { useTranslations } from "next-intl";
import { Modal, Stack, Text, Badge, Group, Button, PasswordInput, ActionIcon } from "@mantine/core";
import { IconKey } from "@tabler/icons-react";
import { formatThaiDate } from "../utils/formatDate";
import type { UserData } from "@/services/user/types";

interface ViewUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: UserData | null;
  onEditPassword?: (user: UserData) => void;
}

export function ViewUserModal({ opened, onClose, user, onEditPassword }: ViewUserModalProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  if (!user) return null;

  const firstAssignment = user.assignments?.[0];

  return (
    <Modal opened={opened} onClose={onClose} title={t("userDetails")} centered size="md">
      <Stack gap="sm">
        <div>
          <Text size="xs" c="dimmed">{t("modal.usernameLabel")}</Text>
          <Text fw={700} size="lg">{user.username}</Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">{t("modal.tenantLabel")}</Text>
          <Text fw={500}>
            {firstAssignment ? firstAssignment.tenantName : "—"}
          </Text>
        </div>

        <div>
          <Text size="xs" c="dimmed">{t("modal.roleLabel")}</Text>
          {firstAssignment ? (
            <Badge variant="light" color="blue">
              {firstAssignment.roleName}
            </Badge>
          ) : (
            <Text fw={500}>—</Text>
          )}
        </div>

        <Group justify="space-between" align="flex-end">
          <div style={{ flex: 1 }}>
            <Text size="xs" c="dimmed">{t("password")}</Text>
            <PasswordInput
              value="••••••••"
              readOnly
              variant="filled"
              radius="sm"
            />
          </div>
          {onEditPassword && (
            <ActionIcon
              variant="subtle"
              color="orange"
              size="lg"
              onClick={() => onEditPassword(user)}
              aria-label={t("modal.changePassword")}
              mt="xs"
            >
              <IconKey size={18} />
            </ActionIcon>
          )}
        </Group>

        <div>
          <Text size="xs" c="dimmed">{t("colCreated")}</Text>
          <Text fw={500}>{formatThaiDate(user.createdAt)}</Text>
        </div>

        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose}>
            {tc("close")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}