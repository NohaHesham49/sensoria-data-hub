
import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { SensorChart } from "@/components/dashboard/SensorChart";
import { DeviceList } from "@/components/dashboard/DeviceList";
import { useSensorData, useLatestSensorData } from "@/hooks/useSensorData";
import { useDevices } from "@/hooks/useDevices";
import { 
  ChartBar,
  ToggleLeft,
  Monitor
} from "lucide-react";

const Dashboard = () => {
  const { data: historicalData = [], isLoading: isLoadingHistory } = useSensorData(24);
  const { data: latestData, isLoading: isLoadingLatest } = useLatestSensorData();
  const { data: devices = [], isLoading: isLoadingDevices } = useDevices();

  if (isLoadingHistory || isLoadingLatest || isLoadingDevices) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </MainLayout>
    );
  }

  if (!latestData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">No sensor data available</div>
        </div>
      </MainLayout>
    );
  }

  // Calculate changes from previous hour
  const tempChange = historicalData.length > 1 ? 
    latestData.temperature - historicalData[historicalData.length - 2].temperature : 0;
  const humidityChange = historicalData.length > 1 ? 
    latestData.humidity - historicalData[historicalData.length - 2].humidity : 0;
  const pressureChange = historicalData.length > 1 ? 
    latestData.pressure - historicalData[historicalData.length - 2].pressure : 0;
  const lightChange = historicalData.length > 1 ? 
    latestData.light - historicalData[historicalData.length - 2].light : 0;

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <SensorCard 
            title="Temperature" 
            value={latestData.temperature}
            unit="°C"
            type="temperature"
            icon={<ChartBar size={24} className="text-[#FF6B6B]" />}
            change={{ value: parseFloat(tempChange.toFixed(1)), trend: tempChange > 0 ? "up" : tempChange < 0 ? "down" : "none" }}
          />
          <SensorCard 
            title="Humidity" 
            value={latestData.humidity}
            unit="%"
            type="humidity"
            icon={<ChartBar size={24} className="text-[#4ECDC4]" />}
            change={{ value: parseFloat(humidityChange.toFixed(1)), trend: humidityChange > 0 ? "up" : humidityChange < 0 ? "down" : "none" }}
          />
          <SensorCard 
            title="Pressure" 
            value={latestData.pressure}
            unit="hPa"
            type="pressure"
            icon={<ChartBar size={24} className="text-[#8675A9]" />}
            change={{ value: parseFloat(pressureChange.toFixed(1)), trend: pressureChange > 0 ? "up" : pressureChange < 0 ? "down" : "none" }}
          />
          <SensorCard 
            title="Light Level" 
            value={latestData.light}
            unit="lx"
            type="light"
            icon={<ChartBar size={24} className="text-[#FFD166]" />}
            change={{ value: parseFloat(lightChange.toFixed(1)), trend: lightChange > 0 ? "up" : lightChange < 0 ? "down" : "none" }}
          />
          <SensorCard 
            title="Motion" 
            value={latestData.motion}
            type="motion"
            icon={<ToggleLeft size={24} className="text-[#06D6A0]" />}
          />
          <SensorCard 
            title="Total Devices" 
            value={devices.filter(d => d.status !== "offline").length}
            type="default"
            icon={<Monitor size={24} className="text-primary" />}
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <SensorChart 
            title="Temperature (24h)" 
            data={historicalData} 
            dataKey="temperature"
            color="#FF6B6B"
            unit="°C"
          />
          <SensorChart 
            title="Humidity (24h)" 
            data={historicalData} 
            dataKey="humidity"
            color="#4ECDC4"
            unit="%"
          />
        </div>
        
        <DeviceList devices={devices} />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
