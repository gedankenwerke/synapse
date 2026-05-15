"use client";

import { useState } from "react";
import { Container, Stack, Text, Center, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@mantine/hooks";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useCreateUser, useUpdateUser, useDeleteUser } from "./hooks/useUserMutations";
import { mapApiUserToUserData } from "@/services/user/types";
import type { UserData, AssignmentData } from "@/services/user/types";
import { UserToolbar } from "./_components/UsersTab/UsersToolbar";
import { UserTable } from "./_components/UsersTab/UsersTable";
import { UserPagination } from "./_components/UsersTab/UsersPagination";
import { EditUserDrawer } from "./_components/UsersTab/EditUserDrawer";
import {
  AddUserModal,
  DeleteConfirmModal,
} from "./_components/UsersTab/UserModals";
import type { UserFormValues } from "./_components/UsersTab/UserModals";

export default function UserManagementPage() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const {
    data,
    isLoading,
    error: queryError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUsersQuery(debouncedSearch);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const users: UserData[] = data?.pages.flatMap((p) => p.items.map(mapApiUserToUserData)) ?? [];
  const totalItems = data?.pages[0]?.total ?? users.length;

  const handleAddUser = (formData: UserFormValues) => {
    createUser.mutate(
      {
        username: formData.username,
        password: formData.password,
        tenant_id: 1,
      },
      {
        onSuccess: () => {
          closeAdd();
          notifications.show({ title: tc("success"), message: t("success.userAdded"), color: "green" });
        },
        onError: (err: any) => {
          const msg = err?.message || t("error.createFailed");
          notifications.show({ title: tc("error"), message: msg, color: "red" });
        },
      }
    );
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    openEdit();
  };

  const handleSave = (updatedUser: UserData, _updatedAssignments: AssignmentData[]) => {
    updateUser.mutate(
      {
        id: updatedUser.id,
        data: {
          username: updatedUser.username,
          tenant_id: 1,
        },
      },
      {
        onSuccess: () => {
          closeEdit();
          notifications.show({ title: tc("success"), message: t("success.userUpdated"), color: "green" });
        },
        onError: (err: any) => {
          const msg = err?.message || t("error.updateFailed");
          notifications.show({ title: tc("error"), message: msg, color: "red" });
        },
      }
    );
  };

  const handleDelete = (user: UserData) => {
    setSelectedUser(user);
    openDelete();
  };

  const handleDeleteConfirm = () => {
    if (!selectedUser) return;
    deleteUser.mutate(selectedUser.id, {
      onSuccess: () => {
        closeDelete();
        notifications.show({ title: tc("success"), message: t("success.userDeleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  if (queryError) {
    return (
      <Container size="xl" py="md">
        <Text c="red">{t("error.loadFailed")}</Text>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Text fz="xl" fw={700} mb="md">{t("title")}</Text>
      <Stack gap="md">
        <UserToolbar
          searchValue={searchQuery}
          onSearchChange={handleSearchChange}
          onAddUser={openAdd}
        />

        <UserTable
          data={users}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserPagination
          totalItems={totalItems}
          hasNextPage={hasNextPage ?? false}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </Stack>

      <AddUserModal
        opened={addOpened}
        onClose={closeAdd}
        onSave={handleAddUser}
        loading={createUser.isPending}
      />

      <DeleteConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        userName={selectedUser?.username ?? ""}
        loading={deleteUser.isPending}
      />

      <EditUserDrawer
        opened={editOpened}
        onClose={closeEdit}
        user={selectedUser}
        onSave={handleSave}
        loading={updateUser.isPending}
      />
    </Container>
  );
}