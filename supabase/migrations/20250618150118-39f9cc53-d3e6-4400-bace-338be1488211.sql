
-- Create an enum for device types
CREATE TYPE device_type AS ENUM ('Environmental', 'Security', 'Power', 'Other');

-- Create an enum for device status
CREATE TYPE device_status AS ENUM ('online', 'offline', 'warning');

-- Create devices table
CREATE TABLE public.devices (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    status device_status DEFAULT 'offline',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
    type TEXT NOT NULL
);

-- Create sensor_data table
CREATE TABLE public.sensor_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id TEXT NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    pressure DECIMAL(7,2),
    light INTEGER,
    motion BOOLEAN,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create alert_settings table
CREATE TABLE public.alert_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_alerts BOOLEAN DEFAULT false,
    temperature_threshold INTEGER DEFAULT 35,
    humidity_threshold INTEGER DEFAULT 80,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_settings ENABLE ROW LEVEL SECURITY;

-- Add policies for public read access
CREATE POLICY "Public read access for devices"
    ON public.devices
    FOR SELECT
    USING (true);

CREATE POLICY "Public insert access for devices"
    ON public.devices
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public update access for devices"
    ON public.devices
    FOR UPDATE
    USING (true);

CREATE POLICY "Public delete access for devices"
    ON public.devices
    FOR DELETE
    USING (true);

CREATE POLICY "Public read access for sensor data"
    ON public.sensor_data
    FOR SELECT
    USING (true);

CREATE POLICY "Public insert access for sensor data"
    ON public.sensor_data
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public read access for alert settings"
    ON public.alert_settings
    FOR SELECT
    USING (true);

CREATE POLICY "Public update access for alert settings"
    ON public.alert_settings
    FOR UPDATE
    USING (true);

-- Function to update device last_seen on new sensor data
CREATE OR REPLACE FUNCTION public.update_device_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.devices
    SET last_seen = NEW.timestamp,
        status = 'online'
    WHERE id = NEW.device_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for device last_seen
CREATE TRIGGER update_device_last_seen_trigger
    AFTER INSERT ON public.sensor_data
    FOR EACH ROW
    EXECUTE FUNCTION public.update_device_last_seen();

-- Create default alert settings
INSERT INTO public.alert_settings (email_alerts, temperature_threshold, humidity_threshold)
VALUES (false, 35, 80);

-- Enable realtime functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_data;

-- Set replica identity for realtime
ALTER TABLE public.devices REPLICA IDENTITY FULL;
ALTER TABLE public.sensor_data REPLICA IDENTITY FULL;
