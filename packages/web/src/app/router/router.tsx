import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import { DashboardHomeRoute } from "@/routes/dashboard/DashboardHomeRoute";
import { ProtectedLayout } from "@/routes/protected/ProtectedRoute";
import { WorkspaceRoute } from "@/routes/dashboard/DashboardWorkspaceRoute";
import { DashboardPipelinesRoute } from "@/routes/dashboard/DashboardPipelinesRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardHomeRoute /> },
              { path: "workspace", element: <WorkspaceRoute /> },
              { path: "pipelines", element: <DashboardPipelinesRoute /> },
            ],
          },
        ],
      },
    ],
  },
]);
