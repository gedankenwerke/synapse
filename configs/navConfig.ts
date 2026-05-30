import {
  IconChartBar,
  IconFileDescription,
  IconArrowsExchange,
  IconBuildingBank,
  IconUsers,
  IconScale,
  IconRobot,
} from "@tabler/icons-react";
import type { PolicyName } from "@/services/policy/types";

export interface NavItem {
  labelKey: string;
  icon: typeof IconChartBar;
  href: string;
  policy: PolicyName;
}

const navItems: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/dashboard", policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement", policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance", policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals", policy: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/customer-settlement", policy: "Settlement" },
  { labelKey: "payAgent", icon: IconRobot, href: "/pay-agent", policy: "CreatePayAgent" },
  { labelKey: "userManagement", icon: IconUsers, href: "/user-management", policy: "ListUsers" },
];

export function getNavItems(): NavItem[] {
  return navItems;
}