import { createBrowserRouter, Navigate } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import { ProtectedLayout } from "@/routes/protected/ProtectedRoute";

import { DashboardHomeRoute } from "@/routes/dashboard/DashboardHomeRoute";

import { DashboardPipelinesRoute } from "@/routes/dashboard/pipelines/DashboardPipelinesRoute";
import { PipelineEditorRoute } from "@/routes/dashboard/pipelines/PipelineEditorRoute";
import { CreatePipelineRoute } from "@/routes/dashboard/pipelines/CreatePipelineRoute";
import { LoginRoute } from "@/routes/auth/LoginRoute";
import { SignupRoute } from "@/routes/auth/SignupRoute";
import { PublicLayout } from "../layouts/PublicLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public routes
      {
        element: <PublicLayout />,
        children: [
          {
            path: "login",
            element: <LoginRoute />,
          },
          {
            path: "signup",
            element: <SignupRoute />,
          },
        ],
      },

      // Protected routes
      {
        element: <ProtectedLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
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
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  pipelines: "/dashboard/pipelines",
  newPipeline: "/dashboard/pipelines/new",
  pipeline: (id: string) => `/dashboard/pipelines/${id}`,
};
