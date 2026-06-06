import { useQuery } from "@tanstack/react-query";
import { getPipeline, listPipelines } from "../api/pipeline.api";
import { SavedPipeline } from "@imgproc/shared";
import { ErrorResponse } from "@imgproc/shared";
import { useAuthStore } from "@/features/auth";

export function usePipelines() {
  const isSignedIn = !!useAuthStore((s) => s.user);

  return useQuery<SavedPipeline[], ErrorResponse["error"]>({
    queryKey: ["pipelines"],
    queryFn: listPipelines,
    enabled: isSignedIn,
  });
}

export function usePipeline(id: string) {
  return useQuery<SavedPipeline, ErrorResponse["error"]>({
    queryKey: ["pipeline", id],
    queryFn: () => getPipeline(id),
    enabled: !!id,
  });
}
