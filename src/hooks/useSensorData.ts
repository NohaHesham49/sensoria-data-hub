
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SensorData } from "@/lib/utils/sensor-data";

export const useSensorData = (hours: number = 24) => {
  return useQuery({
    queryKey: ["sensorData", hours],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .gte("timestamp", new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
        .order("timestamp", { ascending: true });
      
      if (error) throw error;
      
      return data.map(item => ({
        timestamp: item.timestamp,
        temperature: parseFloat(item.temperature || "0"),
        humidity: parseFloat(item.humidity || "0"),
        pressure: parseFloat(item.pressure || "0"),
        light: item.light || 0,
        motion: item.motion || false,
      })) as SensorData[];
    },
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
};

export const useLatestSensorData = () => {
  return useQuery({
    queryKey: ["latestSensorData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      return {
        timestamp: data.timestamp,
        temperature: parseFloat(data.temperature || "0"),
        humidity: parseFloat(data.humidity || "0"),
        pressure: parseFloat(data.pressure || "0"),
        light: data.light || 0,
        motion: data.motion || false,
      } as SensorData;
    },
    refetchInterval: 5000,
  });
};
