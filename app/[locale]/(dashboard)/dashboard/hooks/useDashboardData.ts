import { useQuery } from "@tanstack/react-query";
import { transaction } from "@/services/transaction";
import { netBalance } from "@/services/net-balance";
import { userService } from "@/services/user";
import { useAppStore } from "@/store/useAppStore";
import type { DashboardStatCard, DashboardTransaction, DashboardAreaDatum, DashboardDonutDatum } from "@/services/dashboard/types";
import { formatBaht } from "@/services/dashboard/types";

// Thai timezone for date formatting
const TH_TZ = "Asia/Bangkok";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now.toLocaleString("en-US", { timeZone: TH_TZ }));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return {
    start_date_time: start.toISOString(),
    end_date_time: end.toISOString(),
  };
}

function getWeekRange() {
  const now = new Date();
  const end = new Date(now.toLocaleString("en-US", { timeZone: TH_TZ }));
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);
  return {
    start_date_time: start.toISOString(),
    end_date_time: end.toISOString(),
  };
}

export function useDashboardData() {
  const tenantId = useAppStore((s) => s.user?.tenant_id ?? "1");

  const today = getTodayRange();
  const week = getWeekRange();

  // Fetch today's transactions for stat cards
  const todayTxQuery = useQuery({
    queryKey: ["dashboard-today-transactions", tenantId],
    queryFn: () => transaction.fetchPage({
      after: "",
      before: "",
      limit: 1000,
      start_date_time: today.start_date_time,
      end_date_time: today.end_date_time,
    }),
    staleTime: 60_000,
  });

  // Fetch week's transactions for charts
  const weekTxQuery = useQuery({
    queryKey: ["dashboard-week-transactions", tenantId],
    queryFn: () => transaction.fetchPage({
      after: "",
      before: "",
      limit: 10000,
      start_date_time: week.start_date_time,
      end_date_time: week.end_date_time,
    }),
    staleTime: 60_000,
  });

  // Fetch net balance for total balance
  const netBalanceQuery = useQuery({
    queryKey: ["dashboard-net-balance", tenantId],
    queryFn: () => netBalance.fetchPage({
      after: "",
      before: "",
      limit: 1000,
      start_date_time: today.start_date_time,
      end_date_time: today.end_date_time,
    }),
    staleTime: 60_000,
  });

  // Fetch user count
  const usersQuery = useQuery({
    queryKey: ["dashboard-user-count", tenantId],
    queryFn: () => userService.list({ limit: 1, tenant_id: tenantId }),
    staleTime: 60_000,
  });

  const isLoading = todayTxQuery.isLoading || weekTxQuery.isLoading || netBalanceQuery.isLoading || usersQuery.isLoading;
  const error = todayTxQuery.error || weekTxQuery.error || netBalanceQuery.error || usersQuery.error;

  // Compute stat cards
  const todayDeposits = (todayTxQuery.data?.items ?? [])
    .filter((t) => t.trans_type === "Deposit")
    .reduce((sum, t) => sum + t.dp_wd_amt, 0);
  const todayWithdrawals = (todayTxQuery.data?.items ?? [])
    .filter((t) => t.trans_type === "Withdraw")
    .reduce((sum, t) => sum + t.dp_wd_amt, 0);
  const totalBalance = (netBalanceQuery.data?.items ?? [])
    .reduce((sum, b) => sum + b.acct_deposit - b.acct_withdraw, 0);
  const activeUsers = usersQuery.data?.total ?? 0;

  const statCards: DashboardStatCard[] = [
    { titleKey: "totalBalance", value: formatBaht(totalBalance), change: null, icon: "wallet" },
    { titleKey: "todayDeposits", value: formatBaht(todayDeposits), change: null, icon: "deposit" },
    { titleKey: "todayWithdrawals", value: formatBaht(todayWithdrawals), change: null, icon: "withdrawal" },
    { titleKey: "activeUsers", value: activeUsers.toLocaleString(), change: null, icon: "users" },
  ];

  // Compute area chart data (last 7 days, grouped by date)
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekItems = weekTxQuery.data?.items ?? [];

  // Group by date
  const dayMap = new Map<string, { Deposits: number; Withdrawals: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    dayMap.set(key, { Deposits: 0, Withdrawals: 0 });
  }

  for (const tx of weekItems) {
    const dateStr = new Date(tx.create_date).toISOString().slice(0, 10);
    const entry = dayMap.get(dateStr);
    if (entry) {
      if (tx.trans_type === "Deposit") entry.Deposits += tx.dp_wd_amt;
      else entry.Withdrawals += tx.dp_wd_amt;
    }
  }

  const areaChartData: DashboardAreaDatum[] = Array.from(dayMap.entries()).map(([date, vals]) => {
    const d = new Date(date + "T00:00:00");
    return {
      date: dayNames[d.getDay()],
      ...vals,
    };
  });

  // Compute donut chart data (transaction status)
  const statusMap = new Map<string, number>();
  for (const tx of weekItems) {
    const status = tx.send_status === "3" ? "Completed" : tx.res_status === "1" ? "Failed" : "Pending";
    statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
  }

  const statusColorMap: Record<string, string> = {
    Completed: "green.6",
    Pending: "yellow.6",
    Failed: "red.6",
  };

  const donutChartData: DashboardDonutDatum[] = Array.from(statusMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: statusColorMap[name] ?? "gray.6",
  }));

  // Compute recent transactions (last 10)
  const recentTransactions: DashboardTransaction[] = (todayTxQuery.data?.items ?? [])
    .slice(0, 10)
    .map((t) => ({
      id: String(t.dpwd_trans_id),
      user: t.user_id,
      type: t.trans_type,
      amount: t.dp_wd_amt,
      status: t.send_status === "3" ? "Completed" : t.res_status === "1" ? "Rejected" as const : "Pending" as const,
      date: new Date(t.create_date).toLocaleString("en-GB", { timeZone: TH_TZ }),
    }));

  return {
    statCards,
    areaChartData,
    donutChartData,
    recentTransactions,
    isLoading,
    error,
  };
}