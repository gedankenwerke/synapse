"use client";

import { useState } from "react";
import { Container, Text, Loader, Center, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { usePageGuard } from "@/hooks/usePageGuard";
import { useAppStore } from "@/store/useAppStore";
import { getVisibleTenantIds } from "@/services/tenant/helpers";
import type { Tenant } from "@/services/tenant/types";
import type { TenantCreateRequest, TenantUpdateRequest } from "@/services/tenant/types";
import type { UserData, AssignmentData } from "@/services/user/types";
import { TenantCardGrid } from "./_components/TenantCardGrid/TenantCardGrid";
import {
  EditTenantModal,
  DeleteTenantModal,
} from "./_components/PermissionsTab/TenantModals";
import { UserTable } from "./_components/UserTable/UserTable";
import { UserTableHeader } from "./_components/UserTable/UserTableHeader";
import { UserPagination } from "./_components/UsersTab/UsersPagination";
import { ViewUserModal } from "./_components/UserModals/ViewUserModal";
import { EditUserModal } from "./_components/UserModals/EditUserModal";
import { DeleteConfirmModal } from "./_components/UserModals/DeleteConfirmModal";
import { AddUserModal } from "./_components/UsersTab/UserModals";
import type { UserFormValues } from "./_components/UsersTab/UserModals";
import { useTenantsQuery } from "./hooks/useTenantsQuery";
import { useTenantUsersQuery } from "./hooks/useTenantUsersQuery";
import {
  useUpdateTenant,
  useDeleteTenant,
} from "./hooks/useTenantMutations";
import { useUsersQuery } from "./hooks/useUsersQuery";
import {
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/useUserMutations";
import { mapApiUserToUserData } from "@/services/user/types";
import { useTenantRolesQuery } from "./hooks/useTenantRolesQuery";
import { useTenantPermissionsQuery } from "./hooks/useTenantPermissionsQuery";
import {
  useCreateTenantUser,
  useUpdateTenantUser,
  useDeleteTenantUser,
} from "./hooks/useTenantUserMutations";

export default function UserManagementPage() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");
  const { allowed, loading } = usePageGuard("ListUsers");

  const currentTenantId = useAppStore((s) => s.user?.tenant_id ?? "");
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  // ── Tenant data ──
  const { data: tenants = [] } = useTenantsQuery();
  const { data: tenantUsers = [] } = useTenantUsersQuery();

  // ── Tenant-scoped filtering ──
  const visibleTenantIds = getVisibleTenantIds(currentTenantId, tenants, isSuperAdmin);
  const scopedTenants = isSuperAdmin ? tenants : tenants.filter((t) => visibleTenantIds.includes(t.ID));
  const scopedTenantUsers = isSuperAdmin ? tenantUsers : tenantUsers.filter((tu) => visibleTenantIds.includes(tu.TenantID));

  const tenantMap = new Map(scopedTenants.map((t) => [t.ID, t.Name]));

  // Compute user count per tenant
  const tenantUserCountMap = new Map<string, number>();
  for (const tu of scopedTenantUsers) {
    tenantUserCountMap.set(tu.TenantID, (tenantUserCountMap.get(tu.TenantID) ?? 0) + 1);
  }

  // ── Selected tenant (user list view) ──
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // ── User search ──
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  // ── User data ──
  const usersQuery = useUsersQuery(debouncedSearch);
  const rawUsers = usersQuery.data?.pages.flatMap((p) => p.items) ?? [];
  const users = rawUsers.map(mapApiUserToUserData);

  // Filter users by selected tenant
  const filteredUsers = selectedTenantId
    ? users.filter((u) => u.assignments?.some((a) => a.tenantId === selectedTenantId) || u.tenantId === selectedTenantId)
    : users;

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const createTenantUser = useCreateTenantUser();
  const updateTenantUser = useUpdateTenantUser();
  const deleteTenantUser = useDeleteTenantUser();

  // ── Roles & permissions for edit modal ──
  const { data: roles = [] } = useTenantRolesQuery();
  const { data: permissions = [] } = useTenantPermissionsQuery();

  // ── User modals ──
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  // ── Tenant modals ──
  const [editTenantOpened, { open: openEditTenant, close: closeEditTenant }] = useDisclosure(false);
  const [deleteTenantOpened, { open: openDeleteTenant, close: closeDeleteTenant }] = useDisclosure(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const updateTenant = useUpdateTenant();
  const deleteTenant = useDeleteTenant();

  const handleEditTenant = (tenant: Tenant) => { setSelectedTenant(tenant); openEditTenant(); };

  const handleUpdateTenant = (data: TenantUpdateRequest) => {
    if (!selectedTenant) return;
    updateTenant.mutate({ id: selectedTenant.ID, data }, {
      onSuccess: () => {
        closeEditTenant();
        notifications.show({ title: tc("success"), message: t("tenants.success.updated"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("tenants.error.updateFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleDeleteTenant = (tenant: Tenant) => { setSelectedTenant(tenant); openDeleteTenant(); };

  const handleDeleteTenantConfirm = () => {
    if (!selectedTenant) return;
    deleteTenant.mutate(selectedTenant.ID, {
      onSuccess: () => {
        closeDeleteTenant();
        notifications.show({ title: tc("success"), message: t("tenants.success.deleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("tenants.error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  // ── User handlers ──
  const handleView = (user: UserData) => {
    setSelectedUser(user);
    openView();
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    openEdit();
  };

  const handleSave = (updatedUser: UserData, updatedAssignments: AssignmentData[]) => {
    updateUser.mutate(
      { id: updatedUser.id, data: { username: updatedUser.username, tenant_id: updatedUser.tenantId } },
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

  const handleDeleteUser = (user: UserData) => {
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

  const handleAddUser = (values: UserFormValues) => {
    if (!selectedTenantId) return;
    createUser.mutate(
      { username: values.username, password: values.password, tenant_id: selectedTenantId },
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

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setSearchQuery("");
  };

  const handleBackToTenants = () => {
    setSelectedTenantId(null);
    setSearchQuery("");
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // ── Selected tenant info ──
  const selectedTenantName = selectedTenantId ? (tenantMap.get(selectedTenantId) ?? "") : "";
  const selectedTenantUserCount = selectedTenantId ? (tenantUserCountMap.get(selectedTenantId) ?? 0) : 0;

  // ── Guard: show loader or nothing while checking permissions ──
  if (loading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;

  return (
    <Container size="xl" py="md">
      <Text fz="xl" fw={700} mb="md">{t("title")}</Text>

      {selectedTenantId === null ? (
        <TenantCardGrid
          tenants={scopedTenants}
          tenantUserCounts={tenantUserCountMap}
          tenantMap={tenantMap}
          selectedTenantId={selectedTenantId}
          onSelectTenant={handleSelectTenant}
          onEditTenant={handleEditTenant}
          onDeleteTenant={handleDeleteTenant}
        />
      ) : (
        <Stack>
          <UserTableHeader
            tenantName={selectedTenantName}
            userCount={selectedTenantUserCount}
            searchValue={searchQuery}
            onSearchChange={handleSearchChange}
            onBack={handleBackToTenants}
            onAddUser={openAdd}
          />
          <UserTable
            data={filteredUsers}
            isLoading={usersQuery.isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteUser}
          />
          <UserPagination
            totalItems={filteredUsers.length}
            hasNextPage={!!usersQuery.hasNextPage}
            isFetchingNextPage={usersQuery.isFetchingNextPage}
            fetchNextPage={usersQuery.fetchNextPage}
          />
        </Stack>
      )}

      {/* Tenant modals */}
      <EditTenantModal opened={editTenantOpened} onClose={closeEditTenant} tenant={selectedTenant} onSave={handleUpdateTenant} tenants={scopedTenants} loading={updateTenant.isPending} />
      <DeleteTenantModal opened={deleteTenantOpened} onClose={closeDeleteTenant} onConfirm={handleDeleteTenantConfirm} tenantName={selectedTenant?.Name ?? ""} loading={deleteTenant.isPending} />

      {/* User modals */}
      <ViewUserModal opened={viewOpened} onClose={closeView} user={selectedUser} />
      <EditUserModal opened={editOpened} onClose={closeEdit} user={selectedUser} onSave={handleSave} loading={updateUser.isPending} tenants={scopedTenants} roles={roles} />
      <DeleteConfirmModal opened={deleteOpened} onClose={closeDelete} onConfirm={handleDeleteConfirm} userName={selectedUser?.username ?? ""} loading={deleteUser.isPending} />
      <AddUserModal opened={addOpened} onClose={closeAdd} onSave={handleAddUser} loading={createUser.isPending} />
    </Container>
  );
}