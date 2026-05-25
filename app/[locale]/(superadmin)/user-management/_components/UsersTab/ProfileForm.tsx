"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";
import { TextInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { UserData } from "@/services/user/types";

export interface ProfileFormValues {
  username: string;
  password: string;
}

export interface ProfileFormHandle {
  getValues: () => ProfileFormValues;
  validate: () => boolean;
}

interface ProfileFormProps {
  user: UserData;
}

export const ProfileForm = forwardRef<ProfileFormHandle, ProfileFormProps>(
  function ProfileForm({ user }, ref) {
    const t = useTranslations("userManagement");

    const form = useForm<ProfileFormValues>({
      initialValues: {
        username: user.username,
        password: "",
      },
      validate: {
        username: (val) =>
          val.trim().length > 0 ? null : t("validation.usernameRequired"),
      },
    });

    useImperativeHandle(ref, () => ({
      getValues: () => form.getValues(),
      validate: () => {
        const result = form.validate();
        return !result.hasErrors;
      },
    }));

    return (
      <Stack gap="sm">
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
      </Stack>
    );
  }
);