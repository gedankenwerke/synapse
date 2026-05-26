"use client";

import { useState } from "react";
import { Container, Tabs, Stack, Text, Loader, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@mantine/hooks";
import { usePageGuard } from "@/hooks/usePageGuard";
import { useAppStore } from "@/store/useAppStore";
import { getVisibleTenantIds } from "@/services/tenant/helpers";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useCreateUser, useUpdateUser, useDeleteUser } from "./hooks/useUserMutations";
import { mapApiUserToUserData } from "@/services/user/types";
import type { UserData, AssignmentData } from "@/services/user/types";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";
import { UserPagination } from "./_components/UsersTab/UsersPagination";
import {
  useCreateTenantUser,
  useUpdateTenantUser,
  useDeleteTenantUser,
} from "./hooks/useTenantUserMutations";
import { AddUserModal } from "./_components/UsersTab/UserModals";
import type { UserFormValues } from "./_components/UsersTab/UserModals";
import { TenantCardGrid } from "./_components/TenantCardGrid/TenantCardGrid";
import { UserTable } from "./_components/UserTable/UserTable";
import { UserTableHeader } from "./_components/UserTable/UserTableHeader";
import { ViewUserModal } from "./_components/UserModals/ViewUserModal";
import { EditUserModal } from "./_components/UserModals/EditUserModal";
import { DeleteConfirmModal as NewDeleteConfirmModal } from "./_components/UserModals/DeleteConfirmModal";
import { PermissionsTab } from "./_components/PermissionsTab/PermissionsTab";
import {
  AddTenantModal,
  EditTenantModal,
  DeleteTenantModal,
} from "./_components/PermissionsTab/TenantModals";
import type { TenantFormValues } from "./_components/PermissionsTab/TenantModals";
import { useTenantsQuery } from "./hooks/useTenantsQuery";
import {
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "./hooks/useTenantMutations";
import type { TenantCreateRequest, TenantUpdateRequest } from "@/services/tenant/types";
import {
  AddRoleModal,
  EditRoleModal,
  DeleteRoleModal,
} from "./_components/RolesTab/RolesModals";
import type { RoleFormValues } from "./_components/RolesTab/RolesModals";
import { useTenantRolesQuery } from "./hooks/useTenantRolesQuery";
import {
  useCreateTenantRole,
  useUpdateTenantRole,
  useDeleteTenantRole,
} from "./hooks/useTenantRoleMutations";
import type { TenantRoleCreateRequest, TenantRoleUpdateRequest } from "@/services/tenant-role/types";
import { useTenantUsersQuery } from "./hooks/useTenantUsersQuery";
import { useTenantPermissionsQuery } from "./hooks/useTenantPermissionsQuery";
import {
  useCreateTenantPermission,
  useDeleteTenantPermission,
} from "./hooks/useTenantPermissionMutations";

export default function UserManagementPage() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");
  const { allowed, loading } = usePageGuard("ListUsers");
  if (loading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;
  const currentTenantId = useAppStore((s) => s.user?.tenant_id ?? "");
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);
  const userRole = useAppStore((s) => s.userRole);

  // ── Active tab ──
  const [activeTab, setActiveTab] = useState<string | null>("users");

  // ── Users state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  const {
    data: usersData,
    isLoading: usersLoading,
    error: queryError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUsersQuery(debouncedSearch);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const createTenantUser = useCreateTenantUser();
  const updateTenantUser = useUpdateTenantUser();
  const deleteTenantUser = useDeleteTenantUser();

  const { data: tenantUsers = [] } = useTenantUsersQuery();
  const { data: tenants = [] } = useTenantsQuery();
  const { data: roles = [] } = useTenantRolesQuery();
  const { data: permissions = [] } = useTenantPermissionsQuery();

  // ── Tenant-scoped filtering ──
  const visibleTenantIds = getVisibleTenantIds(currentTenantId, tenants, isSuperAdmin);
  const scopedTenants = isSuperAdmin ? tenants : tenants.filter((t) => visibleTenantIds.includes(t.ID));
  const scopedRoles = isSuperAdmin ? roles : roles.filter((r) => visibleTenantIds.includes(r.TenantID));
  const scopedPermissions = isSuperAdmin ? permissions : permissions.filter((p) => {
    const role = roles.find((r) => r.ID === p.RoleID);
    return role ? visibleTenantIds.includes(role.TenantID) : false;
  });
  const scopedTenantUsers = isSuperAdmin ? tenantUsers : tenantUsers.filter((tu) => visibleTenantIds.includes(tu.TenantID));

  const tenantMap = new Map(scopedTenants.map((t) => [t.ID, t.Name]));
  const roleMap = new Map(scopedRoles.map((r) => [r.ID, r.Name]));
  const permissionMap = new Map<string, string[]>();
  for (const p of scopedPermissions) {
    const list = permissionMap.get(p.RoleID) ?? [];
    list.push(p.Action);
    permissionMap.set(p.RoleID, list);
  }

  const users: UserData[] = (usersData?.pages.flatMap((p) => p.items.map(mapApiUserToUserData)) ?? []).map((user) => {
    const assignments: AssignmentData[] = scopedTenantUsers
      .filter((tu) => tu.UserID === user.id)
      .map((tu) => ({
        id: tu.ID,
        tenantId: tu.TenantID,
        tenantName: tenantMap.get(tu.TenantID) ?? "—",
        roleId: tu.TenantRoleID,
        roleName: roleMap.get(tu.TenantRoleID) ?? "—",
        permissions: permissionMap.get(tu.TenantRoleID) ?? [],
      }));
    return { ...user, assignments };
  });
  const totalItems = usersData?.pages[0]?.total ?? users.length;

  // Compute user count per tenant for card grid
  const tenantUserCountMap = new Map<string, number>();
  for (const tu of scopedTenantUsers) {
    tenantUserCountMap.set(tu.TenantID, (tenantUserCountMap.get(tu.TenantID) ?? 0) + 1);
  }

  // Filter users by selected tenant
  const filteredUsers = selectedTenantId
    ? users.filter((u) => u.assignments.some((a) => a.tenantId === selectedTenantId) || u.tenantId === selectedTenantId)
    : users;

  const handleAddUser = (formData: UserFormValues) => {
    createUser.mutate(
      { username: formData.username, password: formData.password, tenant_id: currentTenantId },
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

  const handleSearchChange = (value: string) => { setSearchQuery(value); };

  const handleView = (user: UserData) => { setSelectedUser(user); openView(); };

  const handleSelectTenant = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    setSearchQuery("");
  };

  const handleBackToTenants = () => {
    setSelectedTenantId(null);
    setSearchQuery("");
  };

  const handleEdit = (user: UserData) => { setSelectedUser(user); openEdit(); };

  const handleSave = (updatedUser: UserData, updatedAssignments: AssignmentData[]) => {
    const originalAssignments = selectedUser?.assignments ?? [];
    const added = updatedAssignments.filter((a) => a.id.startsWith("new-"));
    const removed = originalAssignments.filter(
      (orig) => !updatedAssignments.some((a) => a.id === orig.id)
    );
    const changed = updatedAssignments.filter((a) => {
      if (a.id.startsWith("new-")) return false;
      const orig = originalAssignments.find((o) => o.id === a.id);
      return orig && orig.roleId !== a.roleId;
    });

    updateUser.mutate(
      { id: updatedUser.id, data: { username: updatedUser.username, tenant_id: currentTenantId } },
      {
        onSuccess: () => {
          added.forEach((a) => {
            createTenantUser.mutate({
              user_id: updatedUser.id,
              tenant_id: a.tenantId,
              tenant_role_id: a.roleId,
            });
          });
          removed.forEach((a) => {
            deleteTenantUser.mutate(a.id);
          });
          changed.forEach((a) => {
            updateTenantUser.mutate({ id: a.id, data: { tenant_role_id: a.roleId } });
          });
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

  const handleDelete = (user: UserData) => { setSelectedUser(user); openDelete(); };

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

  // ── Tenants state ──
  const [addTenantOpened, { open: openAddTenant, close: closeAddTenant }] = useDisclosure(false);
  const [editTenantOpened, { open: openEditTenant, close: closeEditTenant }] = useDisclosure(false);
  const [deleteTenantOpened, { open: openDeleteTenant, close: closeDeleteTenant }] = useDisclosure(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { isLoading: tenantsLoading } = useTenantsQuery();
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();
  const deleteTenant = useDeleteTenant();

  const handleAddTenant = (data: TenantCreateRequest) => {
    createTenant.mutate(data, {
      onSuccess: () => {
        closeAddTenant();
        notifications.show({ title: tc("success"), message: t("tenants.success.created"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("tenants.error.createFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

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

  // ── Roles state ──
  const [addRoleOpened, { open: openAddRole, close: closeAddRole }] = useDisclosure(false);
  const [editRoleOpened, { open: openEditRole, close: closeEditRole }] = useDisclosure(false);
  const [deleteRoleOpened, { open: openDeleteRole, close: closeDeleteRole }] = useDisclosure(false);
  const [selectedRole, setSelectedRole] = useState<TenantRole | null>(null);

  const { isLoading: rolesLoading } = useTenantRolesQuery();
  const createRole = useCreateTenantRole();
  const updateRole = useUpdateTenantRole();
  const deleteRole = useDeleteTenantRole();

  // ── Role permissions ──
  const { isLoading: permissionsLoading } = useTenantPermissionsQuery();
  const createPerm = useCreateTenantPermission();
  const deletePerm = useDeleteTenantPermission();

  const handleAddRole = (data: TenantRoleCreateRequest) => {
    createRole.mutate(data, {
      onSuccess: () => {
        closeAddRole();
        notifications.show({ title: tc("success"), message: t("roles.success.created"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("roles.error.createFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleEditRole = (role: TenantRole) => {
    setSelectedRole(role);
    openEditRole();
  };

  const handleUpdateRole = (data: TenantRoleUpdateRequest) => {
    if (!selectedRole) return;
    updateRole.mutate({ id: selectedRole.ID, data }, {
      onSuccess: () => {
        closeEditRole();
        notifications.show({ title: tc("success"), message: t("roles.success.updated"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("roles.error.updateFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleDeleteRole = (role: TenantRole) => { setSelectedRole(role); openDeleteRole(); };

  const handleDeleteRoleConfirm = () => {
    if (!selectedRole) return;
    deleteRole.mutate(selectedRole.ID, {
      onSuccess: () => {
        closeDeleteRole();
        notifications.show({ title: tc("success"), message: t("roles.success.deleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("roles.error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleTogglePermission = (action: string, enabled: boolean) => {
    if (enabled) {
      createPerm.mutate(
        { action, role_id: selectedRole?.ID ?? "" },
        {
          onSuccess: () => {
            notifications.show({ title: tc("success"), message: t("roles.permissions.success.permissionAdded"), color: "green" });
          },
          onError: (err: any) => {
            const msg = err?.message || t("roles.permissions.error.permissionAddFailed");
            notifications.show({ title: tc("error"), message: msg, color: "red" });
          },
        }
      );
    } else {
      const perm = permissions.find((p) => p.RoleID === (selectedRole?.ID ?? "") && p.Action === action);
      if (!perm) return;
      deletePerm.mutate(perm.ID, {
        onSuccess: () => {
          notifications.show({ title: tc("success"), message: t("roles.permissions.success.permissionRemoved"), color: "green" });
        },
        onError: (err: any) => {
          const msg = err?.message || t("roles.permissions.error.permissionRemoveFailed");
          notifications.show({ title: tc("error"), message: msg, color: "red" });
        },
      });
    }
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

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="md">
          <Tabs.Tab value="users">{t("tab.users")}</Tabs.Tab>
          {userRole === "superadmin" && (
            <Tabs.Tab value="permissions">{t("tab.roles")}</Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="users">
          {selectedTenantId === null ? (
            <TenantCardGrid
              tenants={scopedTenants}
              tenantUserCounts={tenantUserCountMap}
              tenantMap={tenantMap}
              selectedTenantId={null}
              onSelectTenant={handleSelectTenant}
            />
          ) : (
            <Stack gap="md">
              <UserTableHeader
                tenantName={tenantMap.get(selectedTenantId) ?? ""}
                userCount={filteredUsers.length}
                searchValue={searchQuery}
                onSearchChange={handleSearchChange}
                onBack={handleBackToTenants}
                onAddUser={openAdd}
              />
              <UserTable
                data={filteredUsers}
                isLoading={usersLoading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              <UserPagination totalItems={totalItems} hasNextPage={hasNextPage ?? false} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="permissions">
          {userRole === "superadmin" && (
          <PermissionsTab
            tenants={scopedTenants}
            roles={scopedRoles}
            permissions={scopedPermissions}
            isLoading={tenantsLoading || rolesLoading}
            permissionsLoading={permissionsLoading}
            isToggling={createPerm.isPending || deletePerm.isPending}
            onTogglePermission={handleTogglePermission}
            onAddDept={openAddTenant}
            onEditDept={handleEditTenant}
            onDeleteDept={handleDeleteTenant}
            onAddRole={openAddRole}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
          />
          )}
        </Tabs.Panel>
      </Tabs>

      {/* Users modals */}
      <ViewUserModal opened={viewOpened} onClose={closeView} user={selectedUser} />
      <EditUserModal
        opened={editOpened}
        onClose={closeEdit}
        user={selectedUser}
        onSave={handleSave}
        loading={updateUser.isPending}
        tenants={scopedTenants}
        roles={scopedRoles}
      />
      <NewDeleteConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleDeleteConfirm}
        userName={selectedUser?.username ?? ""}
        loading={deleteUser.isPending}
      />
      <AddUserModal opened={addOpened} onClose={closeAdd} onSave={handleAddUser} loading={createUser.isPending} />

      {/* Tenant modals */}
      <AddTenantModal opened={addTenantOpened} onClose={closeAddTenant} onSave={handleAddTenant} tenants={scopedTenants} loading={createTenant.isPending} />
      <EditTenantModal opened={editTenantOpened} onClose={closeEditTenant} tenant={selectedTenant} onSave={handleUpdateTenant} tenants={scopedTenants} loading={updateTenant.isPending} />
      <DeleteTenantModal opened={deleteTenantOpened} onClose={closeDeleteTenant} onConfirm={handleDeleteTenantConfirm} tenantName={selectedTenant?.Name ?? ""} loading={deleteTenant.isPending} />

      {/* Role modals */}
      <AddRoleModal opened={addRoleOpened} onClose={closeAddRole} onSave={handleAddRole} loading={createRole.isPending} tenants={scopedTenants} />
      <EditRoleModal opened={editRoleOpened} onClose={closeEditRole} role={selectedRole} onSave={handleUpdateRole} loading={updateRole.isPending} tenants={scopedTenants} />
      <DeleteRoleModal opened={deleteRoleOpened} onClose={closeDeleteRole} onConfirm={handleDeleteRoleConfirm} roleName={selectedRole?.Name ?? ""} loading={deleteRole.isPending} />
    </Container>
  );
}