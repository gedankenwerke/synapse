"use client";

import { AppShell, NavLink } from "@mantine/core";
import { Link, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  IconChartBar,
  IconFileDescription,
  IconArrowsExchange,
  IconKey,
  IconBuildingBank,
  IconUsers,
  IconScale,
  IconRobot,
} from "@tabler/icons-react";

const navItems = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/dashboard" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals" },
  { labelKey: "apiKeys", icon: IconKey, href: "/api-keys" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/customer-settlement" },
  { labelKey: "payAgent", icon: IconRobot, href: "/pay-agent" },
  { labelKey: "userManagement", icon: IconUsers, href: "/user-management" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <AppShell.Section>
      {navItems.map((item) => (
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