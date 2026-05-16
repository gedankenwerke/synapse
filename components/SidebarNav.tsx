"use client";

import { AppShell, NavLink } from "@mantine/core";
import { Link, usePathname } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  IconChartBar,
  IconFileDescription,
  IconArrowsExchange,
  IconBuildingBank,
  IconUsers,
  IconScale,
  IconRobot,
} from "@tabler/icons-react";
import { usePermissionStore } from "@/store/usePermissionStore";
import type { PolicyName } from "@/services/policy/types";

const navItems: { labelKey: string; icon: typeof IconChartBar; href: string; policy: PolicyName }[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/dashboard", policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement", policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance", policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals", policy: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/customer-settlement", policy: "Settlement" },
  { labelKey: "payAgent", icon: IconRobot, href: "/pay-agent", policy: "CreatePayAgent" },
  { labelKey: "userManagement", icon: IconUsers, href: "/user-management", policy: "ListUsers" },
];

export function SidebarNav() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("nav");
  const canSeePage = usePermissionStore((s) => s.canSeePage);

  return (
    <AppShell.Section>
      {navItems
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