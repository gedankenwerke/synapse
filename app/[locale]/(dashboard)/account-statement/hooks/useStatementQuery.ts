import { useInfiniteQuery } from "@tanstack/react-query";
import { accountStatement } from "@/services/account-statement";
import { encodeSearch } from "@/utils/encodeSearch";

const PAGE_LIMIT = 25;

export function useStatementQuery(
  search: string,
  startDateTime: string,
  endDateTime: string
) {
  const isSearch = search.trim().length > 0;

  return useInfiniteQuery({
    queryKey: ["statement", search, startDateTime, endDateTime],
    queryFn: ({ pageParam }) => {
      const after = pageParam || (isSearch ? encodeSearch(search) : "");
      return accountStatement.fetchPage({
        after,
        before: "",
        limit: PAGE_LIMIT,
        start_date_time: startDateTime,
        end_date_time: endDateTime,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.after !== "" ? lastPage.after : undefined,
    refetchInterval: isSearch ? false : 5000,
  });
}