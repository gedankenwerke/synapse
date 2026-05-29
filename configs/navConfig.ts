import {
  IconChartBar,
  IconFileDescription,
  IconArrowsExchange,
  IconBuildingBank,
  IconUsers,
  IconScale,
  IconRobot,
  IconKey,
} from "@tabler/icons-react";
import type { PolicyName } from "@/services/policy/types";
import type { UserRole } from "@/utils/role";

export interface NavItem {
  labelKey: string;
  icon: typeof IconChartBar;
  href: string;
  policy: PolicyName;
}

const dashboardItems: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/dashboard", policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement", policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance", policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals", policy: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/customer-settlement", policy: "Settlement" },
  { labelKey: "payAgent", icon: IconRobot, href: "/pay-agent", policy: "CreatePayAgent" },
  { labelKey: "userManagement", icon: IconUsers, href: "/user-management", policy: "ListUsers" },
  { labelKey: "pats", icon: IconKey, href: "/pats", policy: "ListPats" },
];

export function getNavItems(_role: UserRole): NavItem[] {
  return dashboardItems;
}