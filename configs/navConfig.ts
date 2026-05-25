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
import type { UserRole } from "@/utils/role";

export interface NavItem {
  labelKey: string;
  icon: typeof IconChartBar;
  href: string;
  policy: PolicyName;
}

const superadminItems: NavItem[] = [
  { labelKey: "superadmin", icon: IconChartBar, href: "/superadmin", policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement", policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance", policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals", policy: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/customer-settlement", policy: "Settlement" },
  { labelKey: "payAgent", icon: IconRobot, href: "/pay-agent", policy: "CreatePayAgent" },
  { labelKey: "userManagement", icon: IconUsers, href: "/user-management", policy: "ListUsers" },
];

const seniorItems: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/senior", policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement", policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance", policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals", policy: "SearchTransactionHistory" },
  { labelKey: "customerSettlement", icon: IconBuildingBank, href: "/customer-settlement", policy: "Settlement" },
  { labelKey: "userManagement", icon: IconUsers, href: "/user-management", policy: "ListUsers" },
];

const agentItems: NavItem[] = [
  { labelKey: "dashboard", icon: IconChartBar, href: "/agent", policy: "SearchTransactionHistory" },
  { labelKey: "accountStatement", icon: IconFileDescription, href: "/account-statement", policy: "SearchBankStatement" },
  { labelKey: "netBalance", icon: IconScale, href: "/net-balance", policy: "SearchNetBalance" },
  { labelKey: "transaction", icon: IconArrowsExchange, href: "/deposits-withdrawals", policy: "SearchTransactionHistory" },
];

export function getNavItems(role: UserRole): NavItem[] {
  switch (role) {
    case "superadmin":
      return superadminItems;
    case "senior":
      return seniorItems;
    case "agent":
      return agentItems;
  }
}