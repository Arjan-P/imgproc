import { Loader2Icon } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2Icon className="w-5 h-5 animate-spin text-muted-foreground" />
    </div>
  );
}
