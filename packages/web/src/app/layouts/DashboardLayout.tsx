import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader, AppSidebar } from "@/features/dashborad/";

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
      </SidebarInset>
    </SidebarProvider>
  );
}
