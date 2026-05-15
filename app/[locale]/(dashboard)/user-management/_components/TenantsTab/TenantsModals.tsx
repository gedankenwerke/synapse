"use client";

import { useTranslations } from "next-intl";
import {
  Modal,
  TextInput,
  Select,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Tenant } from "@/services/tenant/types";

export interface TenantFormValues {
  name: string;
  parent_id: string;
}

const defaultFormValues: TenantFormValues = {
  name: "",
  parent_id: "",
};

interface AddTenantModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: TenantFormValues) => void;
  tenants: Tenant[];
  loading?: boolean;
}

export function AddTenantModal({
  opened,
  onClose,
  onSave,
  tenants,
  loading,
}: AddTenantModalProps) {
  const t = useTranslations("userManagement.tenants");
  const tc = useTranslations("common");

  const form = useForm<TenantFormValues>({
    initialValues: { ...defaultFormValues },
    validate: {
      name: (val) =>
        val.trim().length > 0 ? null : t("validation.nameRequired"),
      parent_id: (val) =>
        val.trim().length > 0 ? null : t("validation.parentRequired"),
    },
  });

  const parentOptions = tenants.map((tenant) => ({
    value: tenant.id,
    label: tenant.name,
  }));

  const handleSubmit = (values: TenantFormValues) => {
    onSave(values);
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.addTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t("modal.nameLabel")}
          placeholder={t("modal.namePlaceholder")}
          {...form.getInputProps("name")}
        />
        <Select
          label={t("modal.parentLabel")}
          placeholder={t("modal.parentPlaceholder")}
          data={parentOptions}
          {...form.getInputProps("parent_id")}
          mt="sm"
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

interface EditTenantModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: TenantFormValues) => void;
  tenant: Tenant | null;
  tenants: Tenant[];
  loading?: boolean;
}

export function EditTenantModal({
  opened,
  onClose,
  onSave,
  tenant,
  tenants,
  loading,
}: EditTenantModalProps) {
  const t = useTranslations("userManagement.tenants");
  const tc = useTranslations("common");

  const form = useForm<TenantFormValues>({
    initialValues: {
      name: tenant?.name ?? "",
      parent_id: tenant?.parent_id ?? "",
    },
    validate: {
      name: (val) =>
        val.trim().length > 0 ? null : t("validation.nameRequired"),
      parent_id: (val) =>
        val.trim().length > 0 ? null : t("validation.parentRequired"),
    },
  });

  const parentOptions = tenants.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const handleSubmit = (values: TenantFormValues) => {
    onSave(values);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.editTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={t("modal.nameLabel")}
          placeholder={t("modal.namePlaceholder")}
          {...form.getInputProps("name")}
        />
        <Select
          label={t("modal.parentLabel")}
          placeholder={t("modal.parentPlaceholder")}
          data={parentOptions}
          {...form.getInputProps("parent_id")}
          mt="sm"
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

interface DeleteTenantModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tenantName: string;
  loading?: boolean;
}

export function DeleteTenantModal({
  opened,
  onClose,
  onConfirm,
  tenantName,
  loading,
}: DeleteTenantModalProps) {
  const t = useTranslations("userManagement.tenants");
  const tc = useTranslations("common");

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.deleteTitle")} centered size="sm">
      <Text>
        {t("modal.deleteConfirmation", { name: tenantName })}
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