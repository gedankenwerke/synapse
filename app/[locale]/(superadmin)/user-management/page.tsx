"use client";

import { useState } from "react";
import { Container, Text, Loader, Center } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useTranslations } from "next-intl";
import { usePageGuard } from "@/hooks/usePageGuard";
import { useAppStore } from "@/store/useAppStore";
import { getVisibleTenantIds } from "@/services/tenant/helpers";
import type { Tenant } from "@/services/tenant/types";
import type { TenantCreateRequest, TenantUpdateRequest } from "@/services/tenant/types";
import { TenantCardGrid } from "./_components/TenantCardGrid/TenantCardGrid";
import {
  EditTenantModal,
  DeleteTenantModal,
} from "./_components/PermissionsTab/TenantModals";
import { useTenantsQuery } from "./hooks/useTenantsQuery";
import { useTenantUsersQuery } from "./hooks/useTenantUsersQuery";
import {
  useUpdateTenant,
  useDeleteTenant,
} from "./hooks/useTenantMutations";

export default function UserManagementPage() {
  const t = useTranslations("userManagement");
  const tc = useTranslations("common");
  const { allowed, loading } = usePageGuard("ListUsers");
  if (loading) return <Center mih="100vh"><Loader /></Center>;
  if (!allowed) return null;

  const currentTenantId = useAppStore((s) => s.user?.tenant_id ?? "");
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  // ── Data ──
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

  return (
    <Container size="xl" py="md">
      <Text fz="xl" fw={700} mb="md">{t("title")}</Text>
      <TenantCardGrid
        tenants={scopedTenants}
        tenantUserCounts={tenantUserCountMap}
        tenantMap={tenantMap}
        onEditTenant={handleEditTenant}
        onDeleteTenant={handleDeleteTenant}
      />
      <EditTenantModal opened={editTenantOpened} onClose={closeEditTenant} tenant={selectedTenant} onSave={handleUpdateTenant} tenants={scopedTenants} loading={updateTenant.isPending} />
      <DeleteTenantModal opened={deleteTenantOpened} onClose={closeDeleteTenant} onConfirm={handleDeleteTenantConfirm} tenantName={selectedTenant?.Name ?? ""} loading={deleteTenant.isPending} />
    </Container>
  );
}