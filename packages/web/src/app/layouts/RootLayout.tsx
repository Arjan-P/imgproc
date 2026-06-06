import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../providers/theme-provider";
import { QueryProvider } from "../providers/query-provider";

export function RootLayout() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Outlet />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
