import { useQuery } from "@tanstack/react-query";
import { patService } from "@/services/pats";

export function usePatsQuery() {
  return useQuery({
    queryKey: ["pats"],
    queryFn: () => patService.list(),
    staleTime: 60_000,
  });
}