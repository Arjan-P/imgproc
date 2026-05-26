import { useQuery } from "@tanstack/react-query";
import { getPipeline, listPipelines } from "../api/pipeline.api";
import { SavedPipeline } from "@imgproc/shared";
import { ErrorResponse } from "@imgproc/shared";
import { useAuth } from "@clerk/react";

export function usePipelines() {
  const { isSignedIn } = useAuth();

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
