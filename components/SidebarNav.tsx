"use client";

import { AppShell, NavLink } from "@mantine/core";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePermissionStore } from "@/store/usePermissionStore";
import { useAppStore } from "@/store/useAppStore";
import { getNavItems } from "@/configs/navConfig";
import { IconChartBar } from "@tabler/icons-react";

export function SidebarNav() {
  const pathname = usePathname();
  const params = useParams();
  const tenantId = params.tenantId as string;
  const t = useTranslations("nav");
  const canSeePage = usePermissionStore((s) => s.canSeePage);
  const policies = usePermissionStore((s) => s.policies);
  const userActions = usePermissionStore((s) => s.userActions);
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  // Subscribe to policies, userActions, and isSuperAdmin to trigger re-render when they change
  void policies;
  void userActions;
  void isSuperAdmin;

  const items = getNavItems();

  // Dashboard is always visible as the landing page
  const dashboardHref = `/${tenantId}/dashboard`;

  return (
    <AppShell.Section>
      <NavLink
        label={t("dashboard")}
        leftSection={<IconChartBar size={20} />}
        active={pathname.startsWith(dashboardHref)}
        component={Link}
        href={dashboardHref}
      />
      {items
        .filter((item) => item.labelKey !== "dashboard" && canSeePage(item.policy))
        .map((item) => {
          const href = item.href(tenantId);
          return (
            <NavLink
              key={href}
              label={t(item.labelKey)}
              leftSection={<item.icon size={20} />}
              active={pathname.startsWith(href)}
              component={Link}
              href={href}
            />
          );
        })}
    </AppShell.Section>
  );
}