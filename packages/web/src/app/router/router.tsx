import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import { WorkspaceLayout } from "../layouts/WorkspaceLayout";

import { DashboardHomeRoute } from "@/routes/dashboard/DashboardHomeRoute";
import { WorkspaceRoute } from "@/routes/workspace/workspace";
import { ProtectedLayout } from "@/routes/protected/ProtectedRoute";

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
              {
                index: true,
                element: <DashboardHomeRoute />,
              },
            ],
          },

          {
            path: "workspace",
            element: <WorkspaceLayout />,
            children: [
              {
                index: true,
                element: <WorkspaceRoute />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
