import { useInfiniteQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";
import { useAppStore } from "@/store/useAppStore";

const PAGE_LIMIT = 10;

export function useUsersQuery(search: string, selectedTenantId?: string | null) {
  const tenantId = useAppStore((s) => s.user?.tenant_id ?? "");
  const isSuperAdmin = useAppStore((s) => s.isSuperAdmin);

  // When a specific tenant is selected in the drill-down, filter by that tenant.
  // Otherwise, superadmin sees all users; non-superadmin sees only their own tenant.
  const effectiveTenantId = selectedTenantId
    ? selectedTenantId
    : isSuperAdmin
      ? undefined
      : tenantId;

  return useInfiniteQuery({
    queryKey: ["users", search, effectiveTenantId],
    queryFn: ({ pageParam }) => {
      const after = typeof pageParam === "string" ? pageParam : "";
      return userService.list({
        after,
        before: "",
        limit: PAGE_LIMIT,
        username: search || undefined,
        tenant_id: effectiveTenantId,
      });
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) =>
      lastPage.after !== "" ? lastPage.after : undefined,
    staleTime: 60_000,
  });
}