
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AlertSettings {
  id: string;
  email_alerts: boolean;
  temperature_threshold: number;
  humidity_threshold: number;
  created_at: string;
  updated_at: string;
}

export const useAlertSettings = () => {
  return useQuery({
    queryKey: ["alertSettings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_settings")
        .select("*")
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as AlertSettings;
    },
  });
};

export const useUpdateAlertSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<AlertSettings>) => {
      const { data, error } = await supabase
        .from("alert_settings")
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq("id", settings.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alertSettings"] });
    },
  });
};
