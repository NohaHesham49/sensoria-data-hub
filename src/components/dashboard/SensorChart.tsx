
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorData } from "@/lib/utils/sensor-data";
import { format, parseISO } from "date-fns";

interface SensorChartProps {
  title: string;
  data: SensorData[];
  dataKey: keyof SensorData;
  color: string;
  unit?: string;
}

export function SensorChart({
  title,
  data,
  dataKey,
  color,
  unit = ""
}: SensorChartProps) {
  // Formatter for the tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const timestamp = label ? parseISO(label) : new Date();
      
      return (
        <div className="bg-card p-2 border rounded-md shadow-sm">
          <p className="text-sm font-medium">{format(timestamp, "MMM d, h:mm a")}</p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium" style={{ color }}>
              {value} {unit}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Format the time for X-axis
  const formatTime = (timestamp: string) => {
    return format(parseISO(timestamp), "ha");
  };

  return (
    <Card className="p-0">
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.1} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                tick={{ fontSize: 12 }} 
                stroke="#888"
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                stroke="#888"
                tickLine={false}
                axisLine={false}
                unit={unit}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={dataKey as string}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: color, stroke: "#fff" }}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
