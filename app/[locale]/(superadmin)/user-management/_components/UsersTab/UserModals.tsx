"use client";

import { useTranslations } from "next-intl";
import {
  Modal,
  SimpleGrid,
  TextInput,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";

export interface UserFormValues {
  username: string;
  password: string;
}

const defaultFormValues: UserFormValues = {
  username: "",
  password: "",
};

interface AddUserModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: UserFormValues) => void;
  loading?: boolean;
}

export function AddUserModal({ opened, onClose, onSave, loading }: AddUserModalProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  const form = useForm<UserFormValues>({
    initialValues: { ...defaultFormValues },
    validate: {
      username: (val) =>
        val.trim().length > 0 ? null : t("validation.usernameRequired"),
      password: (val) =>
        val.trim().length > 0 ? null : t("validation.passwordRequired"),
    },
  });

  const handleSubmit = (values: UserFormValues) => {
    onSave(values);
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.addTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2}>
          <TextInput
            label={t("modal.usernameLabel")}
            placeholder={t("modal.usernamePlaceholder")}
            {...form.getInputProps("username")}
          />
          <TextInput
            label={t("modal.passwordLabel")}
            placeholder={t("modal.passwordPlaceholder")}
            type="password"
            {...form.getInputProps("password")}
          />
        </SimpleGrid>
        <Group justify="flex-end" mt="xl">
          <Button variant="default" onClick={onClose} disabled={loading}>
            {tc("cancel")}
          </Button>
          <Button type="submit" loading={loading}>
            {tc("save")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

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