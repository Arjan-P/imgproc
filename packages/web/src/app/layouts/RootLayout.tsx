import { ClerkProvider } from "@clerk/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "../providers/theme-provider";
import { ApiProvider } from "../providers/api-provider";
import { QueryProvider } from "../providers/query-provider";

export function RootLayout() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <QueryProvider>
        <ApiProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Outlet />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </ApiProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
