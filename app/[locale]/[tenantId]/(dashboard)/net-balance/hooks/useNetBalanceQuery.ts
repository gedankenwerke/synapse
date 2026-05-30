import { useQuery } from "@tanstack/react-query";
import { netBalance } from "@/services/net-balance";

export function useNetBalanceQuery(
  startDateTime: string,
  endDateTime: string
) {
  return useQuery({
    queryKey: ["netBalance", startDateTime, endDateTime],
    queryFn: () =>
      netBalance.fetchPage({
        after: "",
        before: "",
        limit: 25,
        start_date_time: startDateTime,
        end_date_time: endDateTime,
      }),
    refetchInterval: 30000,
  });
}