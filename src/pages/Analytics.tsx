import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSensorData } from "@/hooks/useSensorData";
import { format, parseISO } from "date-fns";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("24h");
  
  // Calculate hours based on time range
  const hours = timeRange === "24h" ? 24 : timeRange === "7d" ? 24 * 7 : 24 * 30;
  const { data = [], isLoading } = useSensorData(hours);
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics data...</div>
        </div>
      </MainLayout>
    );
  }

  // Calculate average values
  const calculateAverages = () => {
    if (data.length === 0) return { temperature: 0, humidity: 0, pressure: 0, light: 0 };
    
    const sum = data.reduce((acc, item) => ({
      temperature: acc.temperature + item.temperature,
      humidity: acc.humidity + item.humidity,
      pressure: acc.pressure + item.pressure,
      light: acc.light + item.light
    }), { temperature: 0, humidity: 0, pressure: 0, light: 0 });
    
    return {
      temperature: parseFloat((sum.temperature / data.length).toFixed(1)),
      humidity: parseFloat((sum.humidity / data.length).toFixed(1)),
      pressure: parseFloat((sum.pressure / data.length).toFixed(1)),
      light: parseFloat((sum.light / data.length).toFixed(1))
    };
  };
  
  const averages = calculateAverages();
  
  // Calculate min and max values
  const mins = {
    temperature: data.length > 0 ? Math.min(...data.map(d => d.temperature)) : 0,
    humidity: data.length > 0 ? Math.min(...data.map(d => d.humidity)) : 0,
    pressure: data.length > 0 ? Math.min(...data.map(d => d.pressure)) : 0,
    light: data.length > 0 ? Math.min(...data.map(d => d.light)) : 0
  };
  
  const maxs = {
    temperature: data.length > 0 ? Math.max(...data.map(d => d.temperature)) : 0,
    humidity: data.length > 0 ? Math.max(...data.map(d => d.humidity)) : 0,
    pressure: data.length > 0 ? Math.max(...data.map(d => d.pressure)) : 0,
    light: data.length > 0 ? Math.max(...data.map(d => d.light)) : 0
  };
  
  // Format time for x axis
  const formatXAxis = (timestamp: string) => {
    const date = parseISO(timestamp);
    return timeRange === "24h" 
      ? format(date, "HH:mm") 
      : timeRange === "7d"
        ? format(date, "dd/MM")
        : format(date, "dd/MM");
  };
  
  // Prepare data for pie chart
  const motionPieData = [
    { name: "Motion Detected", value: data.filter(d => d.motion).length },
    { name: "No Motion", value: data.filter(d => !d.motion).length }
  ];
  
  const COLORS = ["#0088FE", "#BBBBBB"];
  
  // Function to sample data for charts (to avoid overcrowding)
  const sampleData = () => {
    const sampleRate = timeRange === "24h" ? 1 : timeRange === "7d" ? 4 : 12;
    return data.filter((_, index) => index % sampleRate === 0);
  };
  
  const sampledData = sampleData();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Analytics &amp; Insights</h1>
          
          <Tabs defaultValue="24h" value={timeRange} onValueChange={setTimeRange} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="24h">Last 24 Hours</TabsTrigger>
              <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
              <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">Avg. Temperature</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-3xl font-bold">{averages.temperature}°C</div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {mins.temperature}°C - {maxs.temperature}°C
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">Avg. Humidity</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-3xl font-bold">{averages.humidity}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {mins.humidity}% - {maxs.humidity}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">Avg. Pressure</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-3xl font-bold">{averages.pressure} hPa</div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {mins.pressure} hPa - {maxs.pressure} hPa
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm text-muted-foreground">Avg. Light</CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="text-3xl font-bold">{averages.light} lx</div>
              <p className="text-xs text-muted-foreground mt-1">
                Range: {mins.light} lx - {maxs.light} lx
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Temperature & Humidity</CardTitle>
              <CardDescription>
                Correlation over {timeRange === "24h" ? "the last 24 hours" : 
                  timeRange === "7d" ? "the last week" : "the last month"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sampledData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatXAxis}
                      tick={{ fontSize: 12 }} 
                      stroke="#888"
                    />
                    <YAxis 
                      yAxisId="left" 
                      domain={['auto', 'auto']} 
                      tick={{ fontSize: 12 }} 
                      stroke="#FF6B6B" 
                      label={{ value: '°C', position: 'insideLeft', angle: -90, dy: 40 }} 
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      domain={[0, 100]} 
                      tick={{ fontSize: 12 }} 
                      stroke="#4ECDC4" 
                      label={{ value: '%', position: 'insideRight', angle: 90, dy: 40 }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#FF6B6B" 
                      name="Temperature"
                      dot={false} 
                      strokeWidth={2}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#4ECDC4" 
                      name="Humidity" 
                      dot={false}
                      strokeWidth={2}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Light Levels</CardTitle>
              <CardDescription>
                Light intensity fluctuations
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sampledData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatXAxis} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'lx', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="light" 
                      stroke="#FFD166" 
                      fill="#FFD166" 
                      fillOpacity={0.3} 
                      name="Light Level" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pressure Trends</CardTitle>
              <CardDescription>
                Atmospheric pressure changes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sampledData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={formatXAxis} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[990, 1030]} 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'hPa', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="pressure" 
                      fill="#8675A9" 
                      name="Pressure" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Motion Detection</CardTitle>
              <CardDescription>
                Frequency of motion detection events
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={motionPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {motionPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} events`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
