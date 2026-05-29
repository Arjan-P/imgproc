import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickCardProps {
  icon: React.ElementType;
  color: string;
  title: string;
  desc: string;
  onClick: () => void;
}

export function QuickCard({
  icon: Icon,
  color,
  title,
  desc,
  onClick,
}: QuickCardProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="h-auto w-full justify-start p-0 hover:bg-transparent"
    >
      <Card className="w-full transition-colors hover:bg-accent/30">
        <CardContent className="p-4 text-left">
          <div
            className={cn(
              "mb-3 flex h-9 w-9 items-center justify-center rounded-md",
              color,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>

          <p className="mb-1 text-sm font-medium">{title}</p>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {desc}
          </p>
        </CardContent>
      </Card>
    </Button>
  );
}
