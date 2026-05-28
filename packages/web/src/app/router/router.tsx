import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import { ProtectedLayout } from "@/routes/protected/ProtectedRoute";

import { DashboardHomeRoute } from "@/routes/dashboard/DashboardHomeRoute";

import { DashboardPipelinesRoute } from "@/routes/dashboard/pipelines/DashboardPipelinesRoute";
import { PipelineEditorRoute } from "@/routes/dashboard/pipelines/PipelineEditorRoute";
import { CreatePipelineRoute } from "@/routes/dashboard/pipelines/CreatePipelineRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              {
                index: true,
                element: <DashboardHomeRoute />,
              },

              {
                path: "pipelines",
                children: [
                  {
                    index: true,
                    element: <DashboardPipelinesRoute />,
                  },

                  {
                    path: "new",
                    element: <CreatePipelineRoute />,
                  },

                  {
                    path: ":pipelineId",
                    element: <PipelineEditorRoute />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export const ROUTES = {
  dashboard: "/dashboard",
  pipelines: "/dashboard/pipelines",
  newPipeline: "/dashboard/pipelines/new",
  pipeline: (id: string) => `/dashboard/pipelines/${id}`,
};
