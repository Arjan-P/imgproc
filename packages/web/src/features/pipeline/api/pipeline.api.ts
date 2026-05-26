import { api } from "@/lib/api";
import { Op, SuccessResponse, SavedPipeline } from "@imgproc/shared";

export interface SavePipelineInput {
  name: string;
  ops: Op[];
}

export async function listPipelines() {
  const res =
    await api.get<SuccessResponse<{ pipelines: SavedPipeline[] }>>(
      "/api/pipelines",
    );

  return res.data.data.pipelines;
}

export async function getPipeline(id: string) {
  const res = await api.get<SuccessResponse<SavedPipeline>>(
    `/api/pipelines/${id}`,
  );

  return res.data.data;
}

export async function createPipeline(input: SavePipelineInput) {
  const res = await api.post<SuccessResponse<SavedPipeline>>(
    "/api/pipelines",
    input,
  );

  return res.data.data;
}

export async function updatePipeline(id: string, input: SavePipelineInput) {
  const res = await api.patch<SuccessResponse<SavedPipeline>>(
    `/api/pipelines/${id}`,
    input,
  );

  return res.data.data;
}

export async function deletePipeline(id: string) {
  await api.delete(`/api/pipelines/${id}`);
}
