
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SensorCardProps {
  title: string;
  value: number | boolean;
  unit?: string;
  icon?: React.ReactNode;
  type: "temperature" | "humidity" | "pressure" | "light" | "motion" | "default";
  change?: {
    value: number;
    trend: "up" | "down" | "none";
  };
}

export function SensorCard({
  title,
  value,
  unit,
  icon,
  type,
  change
}: SensorCardProps) {
  // Function to convert boolean values to text
  const formatValue = (val: number | boolean) => {
    if (typeof val === "boolean") {
      return val ? "Detected" : "None";
    }
    return val;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-bold",
                  type === "temperature" && "text-[#FF6B6B]",
                  type === "humidity" && "text-[#4ECDC4]",
                  type === "pressure" && "text-[#8675A9]",
                  type === "light" && "text-[#FFD166]",
                  type === "motion" && "text-[#06D6A0]"
                )}
              >
                {formatValue(value)}
              </span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            
            {change && (
              <p className="text-xs text-muted-foreground">
                <span className={cn(
                  change.trend === "up" && "text-[#06D6A0]",
                  change.trend === "down" && "text-[#FF6B6B]"
                )}>
                  {change.trend === "up" ? "↑" : change.trend === "down" ? "↓" : "•"} {Math.abs(change.value)}{unit}
                </span>
                {" "}from last hour
              </p>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "p-2 rounded-full",
              type === "temperature" && "bg-[#FF6B6B]/10",
              type === "humidity" && "bg-[#4ECDC4]/10",
              type === "pressure" && "bg-[#8675A9]/10",
              type === "light" && "bg-[#FFD166]/10",
              type === "motion" && "bg-[#06D6A0]/10",
              type === "default" && "bg-primary/10"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
