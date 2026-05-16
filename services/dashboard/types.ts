export interface DashboardStatCard {
  titleKey: string;      // i18n key like "totalBalance", "todayDeposits", etc.
  value: string;         // formatted string like "฿ 1,250,000.00"
  change: number | null; // percentage change, null means unknown
  icon: string;          // icon key: "wallet", "deposit", "withdrawal", "users"
}

export interface DashboardTransaction {
  id: string;
  user: string;
  type: "Deposit" | "Withdraw";
  amount: number;
  status: "Completed" | "Pending" | "Rejected";
  date: string;
}

export interface DashboardAreaDatum {
  date: string;        // day label like "Mon", "Tue", etc.
  Deposits: number;
  Withdrawals: number;
}

export interface DashboardDonutDatum {
  name: string;       // status label
  value: number;      // count
  color: string;      // Mantine color
}

export function formatBaht(amount: number): string {
  return `฿ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}