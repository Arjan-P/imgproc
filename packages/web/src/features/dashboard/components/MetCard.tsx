import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetCardProps {
  label: string;
  value: string | number;
}

export function MetCard({ label, value }: MetCardProps) {
  return (
    <Card className="bg-muted/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-normal text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-2xl font-medium">{value}</p>
      </CardContent>
    </Card>
  );
}
