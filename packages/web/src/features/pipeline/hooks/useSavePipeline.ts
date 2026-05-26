import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPipeline, updatePipeline } from "../api/pipeline.api";
import { type Op } from "@imgproc/shared";

interface SaveArgs {
  id?: string;
  name: string;
  ops: Op[];
}

export function useSavePipeline() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, name, ops }: SaveArgs) => {
      return id
        ? updatePipeline(id, { name, ops })
        : createPipeline({ name, ops });
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["pipelines"],
      });
    },
  });

  return {
    save: mutation.mutateAsync,
    saving: mutation.isPending,
    error: mutation.error,
  };
}
