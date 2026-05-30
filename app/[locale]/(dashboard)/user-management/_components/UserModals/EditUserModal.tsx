"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Modal,
  SimpleGrid,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Divider,
  Stack,
  Text,
} from "@mantine/core";
import { IconKey } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import type { UserData, AssignmentData } from "@/services/user/types";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";

interface EditUserFormValues {
  username: string;
  tenantId: string;
  roleId: string;
  newPassword: string;
  confirmPassword: string;
}

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (updatedUser: UserData, updatedAssignments: AssignmentData[]) => void;
  onChangePassword?: (userId: string, newPassword: string) => void;
  loading?: boolean;
  passwordLoading?: boolean;
  tenants: Tenant[];
  roles: TenantRole[];
}

const MIN_PASSWORD_LENGTH = 6;

export function EditUserModal({
  opened,
  onClose,
  user,
  onSave,
  onChangePassword,
  loading,
  passwordLoading,
  tenants,
  roles,
}: EditUserModalProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  const form = useForm<EditUserFormValues>({
    initialValues: {
      username: "",
      tenantId: "",
      roleId: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      username: (val) =>
        val.trim().length > 0 ? null : t("validation.usernameRequired"),
      confirmPassword: (val, values) => {
        if (!values.newPassword && !val) return null; // both empty = no change
        if (values.newPassword && !val) return t("validation.passwordMismatch");
        if (val !== values.newPassword) return t("validation.passwordMismatch");
        return null;
      },
      newPassword: (val) => {
        if (!val) return null; // empty = no change
        if (val.length < MIN_PASSWORD_LENGTH)
          return t("validation.passwordMinLength", { min: MIN_PASSWORD_LENGTH });
        return null;
      },
    },
  });

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (user && opened) {
      const firstAssignment = user.assignments[0];
      form.setValues({
        username: user.username,
        tenantId: firstAssignment?.tenantId ?? "",
        roleId: firstAssignment?.roleId ?? "",
        newPassword: "",
        confirmPassword: "",
      });
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, opened]);

  // Reset role when tenant changes
  const handleTenantChange = (value: string | null) => {
    form.setFieldValue("tenantId", value ?? "");
    form.setFieldValue("roleId", "");
  };

  const tenantOptions = tenants.map((tenant) => ({
    value: tenant.ID,
    label: tenant.Name,
  }));

  const filteredRoles = roles.filter(
    (role) => role.TenantID === form.getValues().tenantId
  );

  const roleOptions = filteredRoles.map((role) => ({
    value: role.ID,
    label: role.Name,
  }));

  const handleSubmit = (values: EditUserFormValues) => {
    if (!user) return;

    const updatedUser: UserData = {
      ...user,
      username: values.username,
    };

    // Build updated assignments
    let updatedAssignments: AssignmentData[];

    if (values.tenantId && values.roleId) {
      const tenant = tenants.find((t) => t.ID === values.tenantId);
      const role = roles.find((r) => r.ID === values.roleId);
      const existingAssignment = user.assignments[0];

      const newAssignment: AssignmentData = {
        id: existingAssignment?.id ?? `new-${Date.now()}`,
        tenantId: values.tenantId,
        tenantName: tenant?.Name ?? "",
        roleId: values.roleId,
        roleName: role?.Name ?? "",
        permissions: existingAssignment?.permissions ?? [],
      };

      // Replace first assignment, keep rest
      updatedAssignments = [newAssignment, ...user.assignments.slice(1)];
    } else {
      updatedAssignments = user.assignments;
    }

    onSave(updatedUser, updatedAssignments);
  };

  const handleChangePassword = () => {
    if (!user) return;
    const { newPassword, confirmPassword } = form.getValues();
    if (!newPassword || newPassword !== confirmPassword) {
      form.setFieldError("confirmPassword", t("validation.passwordMismatch"));
      return;
    }
    onChangePassword?.(user.id, newPassword);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("editUser")} centered size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2}>
          <TextInput
            label={t("modal.usernameLabel")}
            placeholder={t("modal.usernamePlaceholder")}
            {...form.getInputProps("username")}
          />
          <Select
            label={t("modal.tenantLabel")}
            placeholder={t("modal.tenantPlaceholder")}
            data={tenantOptions}
            {...form.getInputProps("tenantId")}
            onChange={handleTenantChange}
            searchable
          />
          <Select
            label={t("modal.roleLabel")}
            placeholder="Select role"
            data={roleOptions}
            {...form.getInputProps("roleId")}
            searchable
          />
        </SimpleGrid>

        <Divider my="lg" labelPosition="center" label={
          <Group gap="xs">
            <IconKey size={14} />
            <Text size="sm" fw={500}>{t("modal.changePassword")}</Text>
          </Group>
        } />

        <Stack gap="sm">
          <SimpleGrid cols={2}>
            <PasswordInput
              label={t("modal.newPasswordLabel")}
              placeholder={t("modal.newPasswordPlaceholder")}
              {...form.getInputProps("newPassword")}
            />
            <PasswordInput
              label={t("modal.confirmPasswordLabel")}
              placeholder={t("modal.confirmPasswordPlaceholder")}
              {...form.getInputProps("confirmPassword")}
            />
          </SimpleGrid>
          <Group justify="flex-end">
            <Button
              variant="light"
              color="orange"
              leftSection={<IconKey size={16} />}
              onClick={handleChangePassword}
              loading={passwordLoading}
              disabled={!form.getValues().newPassword}
            >
              {t("modal.changePassword")}
            </Button>
          </Group>
        </Stack>

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