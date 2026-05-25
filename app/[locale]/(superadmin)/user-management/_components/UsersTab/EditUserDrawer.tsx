"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Drawer, ScrollArea, Divider, Button, Group, Stack } from "@mantine/core";
import { ProfileForm, type ProfileFormHandle } from "./ProfileForm";
import { AssignmentManager } from "./AssignmentManager";
import type { UserData, AssignmentData } from "@/services/user/types";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";

interface EditUserDrawerProps {
  opened: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (user: UserData, assignments: AssignmentData[]) => void;
  loading?: boolean;
  tenants: Tenant[];
  roles: TenantRole[];
}

export function EditUserDrawer({
  opened,
  onClose,
  user,
  onSave,
  loading,
  tenants,
  roles,
}: EditUserDrawerProps) {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");
  const profileFormRef = useRef<ProfileFormHandle>(null);
  const [localAssignments, setLocalAssignments] = useState<AssignmentData[]>([]);

  useEffect(() => {
    if (user) {
      setLocalAssignments(user.assignments);
    }
  }, [user, opened]);

  const handleSave = () => {
    if (!user || !profileFormRef.current) return;

    const isValid = profileFormRef.current.validate();
    if (!isValid) return;

    const formValues = profileFormRef.current.getValues();
    const updatedUser: UserData = {
      ...user,
      username: formValues.username,
    };

    onSave(updatedUser, localAssignments);
  };

  if (!user) return null;

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={t("drawer.editTitle", { name: user.username })}
      position="right"
      size="500px"
      overlayProps={{ backgroundOpacity: 0.4 }}
    >
      <ScrollArea h="calc(100vh - 140px)" offsetScrollbars>
        <Stack gap="md">
          <Divider label={t("drawer.profileSection")} />

          <ProfileForm ref={profileFormRef} user={user} />

          <Divider label={t("drawer.assignmentsSection")} />

          <AssignmentManager
            assignments={localAssignments}
            onChange={setLocalAssignments}
            tenants={tenants}
            roles={roles}
          />
        </Stack>
      </ScrollArea>

      <Group justify="flex-end" mt="xl" pos="sticky" bottom={0} bg="var(--mantine-color-body)">
        <Button variant="default" onClick={onClose} disabled={loading}>
          {tc("cancel")}
        </Button>
        <Button onClick={handleSave} loading={loading}>
          {t("drawer.saveChanges")}
        </Button>
      </Group>
    </Drawer>
  );
}
