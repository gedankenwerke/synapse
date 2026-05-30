"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Modal,
  SimpleGrid,
  TextInput,
  Select,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { UserData, AssignmentData } from "@/services/user/types";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";

interface EditUserFormValues {
  username: string;
  password: string;
  tenantId: string;
  roleId: string;
}

interface EditUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (updatedUser: UserData, updatedAssignments: AssignmentData[]) => void;
  loading?: boolean;
  tenants: Tenant[];
  roles: TenantRole[];
}

export function EditUserModal({
  opened,
  onClose,
  user,
  onSave,
  loading,
  tenants,
  roles,
}: EditUserModalProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  const form = useForm<EditUserFormValues>({
    initialValues: {
      username: "",
      password: "",
      tenantId: "",
      roleId: "",
    },
    validate: {
      username: (val) =>
        val.trim().length > 0 ? null : t("validation.usernameRequired"),
    },
  });

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (user && opened) {
      const firstAssignment = user.assignments[0];
      form.setValues({
        username: user.username,
        password: "",
        tenantId: firstAssignment?.tenantId ?? "",
        roleId: firstAssignment?.roleId ?? "",
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

  return (
    <Modal opened={opened} onClose={onClose} title={t("editUser")} centered size="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2}>
          <TextInput
            label={t("modal.usernameLabel")}
            placeholder={t("modal.usernamePlaceholder")}
            {...form.getInputProps("username")}
          />
          <TextInput
            label={t("modal.passwordLabel")}
            placeholder="Leave blank to keep current"
            type="password"
            {...form.getInputProps("password")}
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