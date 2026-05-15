"use client";

import { useState } from "react";
import { Container, Tabs, Stack, Text, Center, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { useDebouncedValue } from "@mantine/hooks";
import { useAppStore } from "@/store/useAppStore";
import { useUsersQuery } from "./hooks/useUsersQuery";
import { useCreateUser, useUpdateUser, useDeleteUser } from "./hooks/useUserMutations";
import { mapApiUserToUserData } from "@/services/user/types";
import type { UserData, AssignmentData } from "@/services/user/types";
import type { Tenant } from "@/services/tenant/types";
import type { TenantRole } from "@/services/tenant-role/types";
import type { TenantPermission } from "@/services/tenant-permission/types";
import { UserToolbar } from "./_components/UsersTab/UsersToolbar";
import { UserTable } from "./_components/UsersTab/UsersTable";
import { UserPagination } from "./_components/UsersTab/UsersPagination";
import { EditUserDrawer } from "./_components/UsersTab/EditUserDrawer";
import {
  AddUserModal,
  DeleteConfirmModal,
} from "./_components/UsersTab/UserModals";
import type { UserFormValues } from "./_components/UsersTab/UserModals";
import { TenantsToolbar } from "./_components/TenantsTab/TenantsToolbar";
import { TenantsTable } from "./_components/TenantsTab/TenantsTable";
import {
  AddTenantModal,
  EditTenantModal,
  DeleteTenantModal,
} from "./_components/TenantsTab/TenantsModals";
import { useTenantsQuery } from "./hooks/useTenantsQuery";
import {
  useCreateTenant,
  useUpdateTenant,
  useDeleteTenant,
} from "./hooks/useTenantMutations";
import type { TenantCreateRequest, TenantUpdateRequest } from "@/services/tenant/types";
import { RolesToolbar } from "./_components/RolesTab/RolesToolbar";
import { RolesTable } from "./_components/RolesTab/RolesTable";
import {
  AddRoleModal,
  EditRoleModal,
  DeleteRoleModal,
} from "./_components/RolesTab/RolesModals";
import { useTenantRolesQuery } from "./hooks/useTenantRolesQuery";
import {
  useCreateTenantRole,
  useUpdateTenantRole,
  useDeleteTenantRole,
} from "./hooks/useTenantRoleMutations";
import type { TenantRoleCreateRequest, TenantRoleUpdateRequest } from "@/services/tenant-role/types";
import { PermissionsToolbar } from "./_components/PermissionsTab/PermissionsToolbar";
import { PermissionsTable } from "./_components/PermissionsTab/PermissionsTable";
import {
  AddPermissionModal,
  DeletePermissionModal,
} from "./_components/PermissionsTab/PermissionsModals";
import { useTenantPermissionsQuery } from "./hooks/useTenantPermissionsQuery";
import {
  useCreateTenantPermission,
  useDeleteTenantPermission,
} from "./hooks/useTenantPermissionMutations";
import type { TenantPermissionCreateRequest } from "@/services/tenant-permission/types";

export default function UserManagementPage() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");
  const currentTenantId = useAppStore((s) => s.user?.tenant_id ?? "1");

  // ── Active tab ──
  const [activeTab, setActiveTab] = useState<string | null>("users");

  // ── Users state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

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

  const users: UserData[] = usersData?.pages.flatMap((p) => p.items.map(mapApiUserToUserData)) ?? [];
  const totalItems = usersData?.pages[0]?.total ?? users.length;

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

  const handleEdit = (user: UserData) => { setSelectedUser(user); openEdit(); };

  const handleSave = (updatedUser: UserData, _updatedAssignments: AssignmentData[]) => {
    updateUser.mutate(
      { id: updatedUser.id, data: { username: updatedUser.username, tenant_id: currentTenantId } },
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
  const [tenantSearch, setTenantSearch] = useState("");
  const [debouncedTenantSearch] = useDebouncedValue(tenantSearch, 300);
  const [addTenantOpened, { open: openAddTenant, close: closeAddTenant }] = useDisclosure(false);
  const [editTenantOpened, { open: openEditTenant, close: closeEditTenant }] = useDisclosure(false);
  const [deleteTenantOpened, { open: openDeleteTenant, close: closeDeleteTenant }] = useDisclosure(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { data: tenants = [], isLoading: tenantsLoading } = useTenantsQuery();
  const createTenant = useCreateTenant();
  const updateTenant = useUpdateTenant();
  const deleteTenant = useDeleteTenant();

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(debouncedTenantSearch.toLowerCase())
  );

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
    updateTenant.mutate({ id: selectedTenant.id, data }, {
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
    deleteTenant.mutate(selectedTenant.id, {
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
  const [roleSearch, setRoleSearch] = useState("");
  const [debouncedRoleSearch] = useDebouncedValue(roleSearch, 300);
  const [addRoleOpened, { open: openAddRole, close: closeAddRole }] = useDisclosure(false);
  const [editRoleOpened, { open: openEditRole, close: closeEditRole }] = useDisclosure(false);
  const [deleteRoleOpened, { open: openDeleteRole, close: closeDeleteRole }] = useDisclosure(false);
  const [selectedRole, setSelectedRole] = useState<TenantRole | null>(null);

  const { data: roles = [], isLoading: rolesLoading } = useTenantRolesQuery();
  const createRole = useCreateTenantRole();
  const updateRole = useUpdateTenantRole();
  const deleteRole = useDeleteTenantRole();

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(debouncedRoleSearch.toLowerCase())
  );

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

  const handleEditRole = (role: TenantRole) => { setSelectedRole(role); openEditRole(); };

  const handleUpdateRole = (data: TenantRoleUpdateRequest) => {
    if (!selectedRole) return;
    updateRole.mutate({ id: selectedRole.id, data }, {
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
    deleteRole.mutate(selectedRole.id, {
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

  // ── Permissions state ──
  const [permSearch, setPermSearch] = useState("");
  const [debouncedPermSearch] = useDebouncedValue(permSearch, 300);
  const [addPermOpened, { open: openAddPerm, close: closeAddPerm }] = useDisclosure(false);
  const [deletePermOpened, { open: openDeletePerm, close: closeDeletePerm }] = useDisclosure(false);
  const [selectedPerm, setSelectedPerm] = useState<TenantPermission | null>(null);

  const { data: permissions = [], isLoading: permissionsLoading } = useTenantPermissionsQuery();
  const createPerm = useCreateTenantPermission();
  const deletePerm = useDeleteTenantPermission();

  const filteredPermissions = permissions.filter((p) =>
    p.action.toLowerCase().includes(debouncedPermSearch.toLowerCase())
  );

  const handleAddPermission = (data: TenantPermissionCreateRequest) => {
    createPerm.mutate(data, {
      onSuccess: () => {
        closeAddPerm();
        notifications.show({ title: tc("success"), message: t("permissions.success.created"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("permissions.error.createFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
  };

  const handleDeletePermission = (perm: TenantPermission) => { setSelectedPerm(perm); openDeletePerm(); };

  const handleDeletePermConfirm = () => {
    if (!selectedPerm) return;
    deletePerm.mutate(selectedPerm.id, {
      onSuccess: () => {
        closeDeletePerm();
        notifications.show({ title: tc("success"), message: t("permissions.success.deleted"), color: "green" });
      },
      onError: (err: any) => {
        const msg = err?.message || t("permissions.error.deleteFailed");
        notifications.show({ title: tc("error"), message: msg, color: "red" });
      },
    });
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
          <Tabs.Tab value="tenants">{t("tab.tenants")}</Tabs.Tab>
          <Tabs.Tab value="roles">{t("tab.roles")}</Tabs.Tab>
          <Tabs.Tab value="permissions">{t("tab.permissions")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="users">
          <Stack gap="md">
            <UserToolbar
              searchValue={searchQuery}
              onSearchChange={handleSearchChange}
              onAddUser={openAdd}
            />
            <UserTable data={users} isLoading={usersLoading} onEdit={handleEdit} onDelete={handleDelete} />
            <UserPagination totalItems={totalItems} hasNextPage={hasNextPage ?? false} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="tenants">
          <Stack gap="md">
            <TenantsToolbar
              searchValue={tenantSearch}
              onSearchChange={setTenantSearch}
              onAddTenant={openAddTenant}
            />
            <TenantsTable
              data={filteredTenants}
              tenants={tenants}
              isLoading={tenantsLoading}
              onEdit={handleEditTenant}
              onDelete={handleDeleteTenant}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="roles">
          <Stack gap="md">
            <RolesToolbar
              searchValue={roleSearch}
              onSearchChange={setRoleSearch}
              onAddRole={openAddRole}
            />
            <RolesTable
              data={filteredRoles}
              tenants={tenants}
              isLoading={rolesLoading}
              onEdit={handleEditRole}
              onDelete={handleDeleteRole}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="permissions">
          <Stack gap="md">
            <PermissionsToolbar
              searchValue={permSearch}
              onSearchChange={setPermSearch}
              onAddPermission={openAddPerm}
            />
            <PermissionsTable
              data={filteredPermissions}
              roles={roles}
              isLoading={permissionsLoading}
              onDelete={handleDeletePermission}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>

      {/* Users modals */}
      <AddUserModal opened={addOpened} onClose={closeAdd} onSave={handleAddUser} loading={createUser.isPending} />
      <DeleteConfirmModal opened={deleteOpened} onClose={closeDelete} onConfirm={handleDeleteConfirm} userName={selectedUser?.username ?? ""} loading={deleteUser.isPending} />
      <EditUserDrawer opened={editOpened} onClose={closeEdit} user={selectedUser} onSave={handleSave} loading={updateUser.isPending} tenants={tenants} roles={roles} />

      {/* Tenants modals */}
      <AddTenantModal opened={addTenantOpened} onClose={closeAddTenant} onSave={handleAddTenant} loading={createTenant.isPending} tenants={tenants} />
      <EditTenantModal opened={editTenantOpened} onClose={closeEditTenant} tenant={selectedTenant} onSave={handleUpdateTenant} loading={updateTenant.isPending} tenants={tenants} />
      <DeleteTenantModal opened={deleteTenantOpened} onClose={closeDeleteTenant} onConfirm={handleDeleteTenantConfirm} tenantName={selectedTenant?.name ?? ""} loading={deleteTenant.isPending} />

      {/* Roles modals */}
      <AddRoleModal opened={addRoleOpened} onClose={closeAddRole} onSave={handleAddRole} loading={createRole.isPending} tenants={tenants} />
      <EditRoleModal opened={editRoleOpened} onClose={closeEditRole} role={selectedRole} onSave={handleUpdateRole} loading={updateRole.isPending} tenants={tenants} />
      <DeleteRoleModal opened={deleteRoleOpened} onClose={closeDeleteRole} onConfirm={handleDeleteRoleConfirm} roleName={selectedRole?.name ?? ""} loading={deleteRole.isPending} />

      {/* Permissions modals */}
      <AddPermissionModal opened={addPermOpened} onClose={closeAddPerm} onSave={handleAddPermission} loading={createPerm.isPending} roles={roles} />
      <DeletePermissionModal opened={deletePermOpened} onClose={closeDeletePerm} onConfirm={handleDeletePermConfirm} loading={deletePerm.isPending} />
    </Container>
  );
}
