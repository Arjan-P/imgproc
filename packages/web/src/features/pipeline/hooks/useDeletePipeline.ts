import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePipeline } from "../api/pipeline.api";

export function useDeletePipeline() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deletePipeline,

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["pipelines"],
      });
    },
  });
}
