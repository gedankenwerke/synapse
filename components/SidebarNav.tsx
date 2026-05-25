"use client";

import { AppShell, NavLink } from "@mantine/core";
import { Link, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePermissionStore } from "@/store/usePermissionStore";
import { useAppStore } from "@/store/useAppStore";
import { getNavItems } from "@/configs/navConfig";

export function SidebarNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const canSeePage = usePermissionStore((s) => s.canSeePage);
  const policies = usePermissionStore((s) => s.policies);
  const userRole = useAppStore((s) => s.userRole);
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  // Subscribe to policies and isSuperAdmin to trigger re-render when they change
  // canSeePage itself is a function reference that doesn't change, so we need
  // these subscriptions to ensure the filter re-evaluates after policies load
  void policies;
  void isSuperAdmin;

  const items = getNavItems(userRole);

  return (
    <AppShell.Section>
      {items
        .filter((item) => canSeePage(item.policy))
        .map((item) => (
          <NavLink
            key={item.href}
            label={t(item.labelKey)}
            leftSection={<item.icon size={20} />}
            active={pathname.startsWith(`/${locale}${item.href}`)}
            component={Link}
            href={item.href}
          />
        ))}
    </AppShell.Section>
  );
}