
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Device } from "@/lib/utils/sensor-data";

export const useDevices = () => {
  return useQuery({
    queryKey: ["devices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Device[];
    },
  });
};

export const useAddDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (device: Omit<Device, "id" | "last_seen">) => {
      const newDevice = {
        id: `sensor_${Math.floor(Math.random() * 9000) + 1000}`,
        name: device.name,
        location: device.location,
        type: device.type,
        status: "offline" as const,
        last_seen: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from("devices")
        .insert(newDevice)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (deviceId: string) => {
      const { error } = await supabase
        .from("devices")
        .delete()
        .eq("id", deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
  });
};
