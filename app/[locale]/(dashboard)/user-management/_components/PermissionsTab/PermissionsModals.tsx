"use client";

import { useTranslations } from "next-intl";
import {
  Modal,
  Select,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { TenantRole } from "@/services/tenant-role/types";

const PERMISSION_ACTIONS = [
  "SearchBankStatement",
  "SearchNetBalance",
  "SearchTransactionHistory",
  "CreateTenant",
  "ListTenants",
  "GetTenant",
  "UpdateTenant",
  "DeleteTenant",
  "CreateTenantRole",
  "ListTenantRoles",
  "GetTenantRole",
  "UpdateTenantRole",
  "DeleteTenantRole",
  "CreateTenantPermission",
  "ListTenantPermissions",
  "GetTenantPermission",
  "UpdateTenantPermission",
  "DeleteTenantPermission",
  "CreateTenantUser",
  "ListTenantUsers",
  "GetTenantUser",
  "UpdateTenantUser",
  "DeleteTenantUser",
  "CreateUser",
  "ListUsers",
  "GetUser",
  "UpdateUser",
  "DeleteUser",
];

export interface AddPermissionFormValues {
  action: string;
  role_id: string;
}

interface AddPermissionModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: AddPermissionFormValues) => void;
  loading?: boolean;
  roles: TenantRole[];
}

export function AddPermissionModal({
  opened,
  onClose,
  onSave,
  loading,
  roles,
}: AddPermissionModalProps) {
  const t = useTranslations("userManagement.permissions");
  const tc = useTranslations("common");

  const form = useForm<AddPermissionFormValues>({
    initialValues: {
      action: "",
      role_id: "",
    },
    validate: {
      action: (val) =>
        val.trim().length > 0 ? null : t("validation.actionRequired"),
      role_id: (val) =>
        val.trim().length > 0 ? null : t("validation.roleRequired"),
    },
  });

  const handleSubmit = (values: AddPermissionFormValues) => {
    onSave(values);
    form.reset();
  };

  const roleOptions = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const actionOptions = PERMISSION_ACTIONS.map((action) => ({
    value: action,
    label: action,
  }));

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.addTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
          label={t("modal.actionLabel")}
          placeholder={t("modal.actionPlaceholder")}
          data={actionOptions}
          searchable
          {...form.getInputProps("action")}
        />
        <Select
          label={t("modal.roleLabel")}
          placeholder={t("modal.rolePlaceholder")}
          data={roleOptions}
          searchable
          mt="sm"
          {...form.getInputProps("role_id")}
        />
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

interface DeletePermissionModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeletePermissionModal({
  opened,
  onClose,
  onConfirm,
  loading,
}: DeletePermissionModalProps) {
  const t = useTranslations("userManagement.permissions");
  const tc = useTranslations("common");

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.deleteTitle")} centered size="sm">
      <Text>{t("modal.deleteConfirmation")}</Text>
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