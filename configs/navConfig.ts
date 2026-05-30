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
  href: (tenantId: string) => string;
  policy: PolicyName;
}

const navItems: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: (t) => `/${t}/dashboard`, policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: (t) => `/${t}/account-statement`, policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: (t) => `/${t}/net-balance`, policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: (t) => `/${t}/deposits-withdrawals`, policy: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: (t) => `/${t}/customer-settlement`, policy: "Settlement" },
  { labelKey: "payAgent", icon: IconRobot, href: (t) => `/${t}/pay-agent`, policy: "CreatePayAgent" },
  { labelKey: "userManagement", icon: IconUsers, href: (t) => `/${t}/user-management`, policy: "ListUsers" },
];

export function getNavItems(): NavItem[] {
  return navItems;
}