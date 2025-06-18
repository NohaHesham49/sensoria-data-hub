
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SensorData } from "@/lib/utils/sensor-data";
import { useEffect } from "react";

export const useSensorData = (hours: number = 24) => {
  const queryClient = useQueryClient();

  const query = useQuery({
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
        temperature: Number(item.temperature || 0),
        humidity: Number(item.humidity || 0),
        pressure: Number(item.pressure || 0),
        light: item.light || 0,
        motion: item.motion || false,
      })) as SensorData[];
    },
    refetchInterval: 30000, // Fallback polling every 30 seconds
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('sensor-data-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sensor_data'
        },
        () => {
          // Invalidate and refetch the query when data changes
          queryClient.invalidateQueries({ queryKey: ["sensorData", hours] });
          queryClient.invalidateQueries({ queryKey: ["latestSensorData"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, hours]);

  return query;
};

export const useLatestSensorData = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
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
        temperature: Number(data.temperature || 0),
        humidity: Number(data.humidity || 0),
        pressure: Number(data.pressure || 0),
        light: data.light || 0,
        motion: data.motion || false,
      } as SensorData;
    },
    refetchInterval: 30000, // Fallback polling every 30 seconds
  });

  // Set up real-time subscription for latest data
  useEffect(() => {
    const channel = supabase
      .channel('latest-sensor-data-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data'
        },
        () => {
          // Invalidate and refetch when new data is inserted
          queryClient.invalidateQueries({ queryKey: ["latestSensorData"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
};
