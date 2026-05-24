import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../providers/theme-provider";

export function RootLayout() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>
    </ThemeProvider>
  );
}
