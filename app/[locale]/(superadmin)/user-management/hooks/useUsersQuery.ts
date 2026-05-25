import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { useAppStore } from "@/store/useAppStore";

const PAGE_LIMIT = 10;

export function useUsersQuery(search: string) {
  const tenantId = useAppStore((s) => s.user?.tenant_id ?? "");
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  return useInfiniteQuery({
    queryKey: ["users", search, tenantId, isSuperAdmin],
    queryFn: ({ pageParam }) => {
      const after = typeof pageParam === "string" ? pageParam : "";
      return userService.list({
        after,
        before: "",
        limit: PAGE_LIMIT,
        username: search || undefined,
        tenant_id: isSuperAdmin ? undefined : tenantId,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.after !== "" ? lastPage.after : undefined,
    staleTime: 60_000,
  });
}