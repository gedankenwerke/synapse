import { useQuery } from "@tanstack/react-query";
import { tenant } from "@/services/tenant";

export function useTenantsQuery() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: () => tenant.list(),
    staleTime: 60_000,
  });
}