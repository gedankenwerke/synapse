import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patService } from "@/services/pats";
import type { PatCreateRequest } from "@/services/pats/types";

export function useCreatePat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PatCreateRequest) => patService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pats"] });
    },
  });
}

export function useDeletePat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pats"] });
    },
  });
}