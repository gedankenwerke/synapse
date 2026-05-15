"use client";

import { useTranslations } from "next-intl";
import {
  Modal,
  SimpleGrid,
  TextInput,
  Select,
  Button,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { TenantRole } from "@/services/tenant-role.types";
import type { Tenant } from "@/services/tenant.types";

export interface RoleFormValues {
  name: string;
  tenant_id: string;
}

const defaultFormValues: RoleFormValues = {
  name: "",
  tenant_id: "",
};

interface AddRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: RoleFormValues) => void;
  loading?: boolean;
  tenants: Tenant[];
}

export function AddRoleModal({
  opened,
  onClose,
  onSave,
  loading,
  tenants,
}: AddRoleModalProps) {
  const t = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  const form = useForm<RoleFormValues>({
    initialValues: { ...defaultFormValues },
    validate: {
      name: (val) =>
        val.trim().length > 0 ? null : t("validation.nameRequired"),
      tenant_id: (val) =>
        val.trim().length > 0 ? null : t("validation.tenantRequired"),
    },
  });

  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.id,
    label: tenant.name,
  }));

  const handleSubmit = (values: RoleFormValues) => {
    onSave(values);
    form.reset();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.addTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={1}>
          <TextInput
            label={t("modal.nameLabel")}
            placeholder={t("modal.namePlaceholder")}
            {...form.getInputProps("name")}
          />
          <Select
            label={t("modal.tenantLabel")}
            placeholder={t("modal.tenantPlaceholder")}
            data={tenantOptions}
            {...form.getInputProps("tenant_id")}
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

interface EditRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onSave: (data: RoleFormValues) => void;
  loading?: boolean;
  role: TenantRole | null;
  tenants: Tenant[];
}

export function EditRoleModal({
  opened,
  onClose,
  onSave,
  loading,
  role,
  tenants,
}: EditRoleModalProps) {
  const t = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  const form = useForm<RoleFormValues>({
    initialValues: {
      name: role?.name ?? "",
      tenant_id: role?.tenant_id ?? "",
    },
    validate: {
      name: (val) =>
        val.trim().length > 0 ? null : t("validation.nameRequired"),
      tenant_id: (val) =>
        val.trim().length > 0 ? null : t("validation.tenantRequired"),
    },
  });

  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.id,
    label: tenant.name,
  }));

  const handleSubmit = (values: RoleFormValues) => {
    onSave(values);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.editTitle")} size="lg" centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={1}>
          <TextInput
            label={t("modal.nameLabel")}
            placeholder={t("modal.namePlaceholder")}
            {...form.getInputProps("name")}
          />
          <Select
            label={t("modal.tenantLabel")}
            placeholder={t("modal.tenantPlaceholder")}
            data={tenantOptions}
            {...form.getInputProps("tenant_id")}
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

interface DeleteRoleModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  roleName: string;
  loading?: boolean;
}

export function DeleteRoleModal({
  opened,
  onClose,
  onConfirm,
  roleName,
  loading,
}: DeleteRoleModalProps) {
  const t = useTranslations("userManagement.roles");
  const tc = useTranslations("common");

  return (
    <Modal opened={opened} onClose={onClose} title={t("modal.deleteTitle")} centered size="sm">
      <Text>
        {t("modal.deleteConfirmation", { name: roleName })}
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