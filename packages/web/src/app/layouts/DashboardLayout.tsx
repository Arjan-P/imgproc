import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SiteHeader } from "@/features/dashboard";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="m-2 rounded-2xl border overflow-hidden">
        <SiteHeader />
        <main className="flex-1 min-h-0">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
