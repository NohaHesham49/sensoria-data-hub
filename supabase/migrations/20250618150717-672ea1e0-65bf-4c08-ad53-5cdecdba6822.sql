
-- Insert sample devices
INSERT INTO public.devices (id, name, location, status, type, last_seen) VALUES
('sensor_001', 'Living Room Sensor', 'Living Room', 'online', 'Environmental', now() - interval '2 minutes'),
('sensor_002', 'Kitchen Monitor', 'Kitchen', 'online', 'Environmental', now() - interval '5 minutes'),
('sensor_003', 'Bedroom Climate', 'Master Bedroom', 'warning', 'Environmental', now() - interval '15 minutes'),
('sensor_004', 'Garage Security', 'Garage', 'offline', 'Security', now() - interval '2 hours'),
('sensor_005', 'Office Environment', 'Home Office', 'online', 'Environmental', now() - interval '1 minute'),
('sensor_006', 'Basement Humidity', 'Basement', 'online', 'Environmental', now() - interval '3 minutes'),
('sensor_007', 'Garden Monitor', 'Garden', 'warning', 'Environmental', now() - interval '30 minutes'),
('sensor_008', 'Attic Climate', 'Attic', 'offline', 'Environmental', now() - interval '1 day'),
('sensor_009', 'Front Door Security', 'Front Entrance', 'online', 'Security', now() - interval '1 minute'),
('sensor_010', 'Power Monitor', 'Utility Room', 'online', 'Power', now() - interval '4 minutes');

-- Insert recent sensor data for the last 24 hours (96 data points, every 15 minutes)
INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_001',
    22.5 + (random() * 6 - 3),  -- Temperature between 19.5-25.5°C
    45 + (random() * 20 - 10),  -- Humidity between 35-65%
    1013 + (random() * 20 - 10), -- Pressure between 1003-1023 hPa
    (300 + random() * 700)::integer, -- Light between 300-1000 lx
    random() > 0.8, -- Motion detected 20% of the time
    now() - (interval '15 minutes' * generate_series(0, 95))
FROM generate_series(0, 95);

-- Insert sensor data for sensor_002 (Kitchen)
INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_002',
    24.0 + (random() * 8 - 4),  -- Temperature between 20-28°C (kitchen gets warmer)
    50 + (random() * 25 - 12),  -- Humidity between 38-75%
    1013 + (random() * 15 - 7), -- Pressure between 1006-1020 hPa
    (400 + random() * 600)::integer, -- Light between 400-1000 lx
    random() > 0.7, -- Motion detected 30% of the time
    now() - (interval '15 minutes' * generate_series(0, 95))
FROM generate_series(0, 95);

-- Insert sensor data for sensor_003 (Bedroom)
INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_003',
    20.0 + (random() * 5 - 2),  -- Temperature between 18-23°C (cooler bedroom)
    40 + (random() * 20 - 10),  -- Humidity between 30-60%
    1013 + (random() * 18 - 9), -- Pressure between 1004-1022 hPa
    (50 + random() * 300)::integer, -- Light between 50-350 lx (darker)
    random() > 0.9, -- Motion detected 10% of the time (bedroom)
    now() - (interval '15 minutes' * generate_series(0, 95))
FROM generate_series(0, 95);

-- Insert sensor data for sensor_005 (Office)
INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_005',
    23.0 + (random() * 4 - 2),  -- Temperature between 21-25°C
    42 + (random() * 18 - 9),   -- Humidity between 33-60%
    1013 + (random() * 16 - 8), -- Pressure between 1005-1021 hPa
    (500 + random() * 500)::integer, -- Light between 500-1000 lx (well lit office)
    random() > 0.6, -- Motion detected 40% of the time (active office)
    now() - (interval '15 minutes' * generate_series(0, 95))
FROM generate_series(0, 95);

-- Insert sensor data for sensor_006 (Basement)
INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_006',
    18.0 + (random() * 4 - 2),  -- Temperature between 16-20°C (cooler basement)
    65 + (random() * 20 - 10),  -- Humidity between 55-85% (higher humidity)
    1013 + (random() * 12 - 6), -- Pressure between 1007-1019 hPa
    (100 + random() * 200)::integer, -- Light between 100-300 lx (darker)
    random() > 0.95, -- Motion detected 5% of the time
    now() - (interval '15 minutes' * generate_series(0, 95))
FROM generate_series(0, 95);

-- Insert some recent data for offline/warning devices (older timestamps)
INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_004',
    15.0 + (random() * 10 - 5), -- Garage temperature
    60 + (random() * 30 - 15),
    1013 + (random() * 20 - 10),
    (50 + random() * 150)::integer,
    random() > 0.85,
    now() - interval '2 hours' - (interval '30 minutes' * generate_series(0, 10))
FROM generate_series(0, 10);

INSERT INTO public.sensor_data (device_id, temperature, humidity, pressure, light, motion, timestamp)
SELECT 
    'sensor_007',
    12.0 + (random() * 15 - 7), -- Garden temperature (more variable)
    70 + (random() * 25 - 12),
    1013 + (random() * 25 - 12),
    (800 + random() * 200)::integer, -- Brighter outdoor light
    random() > 0.8,
    now() - interval '30 minutes' - (interval '15 minutes' * generate_series(0, 20))
FROM generate_series(0, 20);

-- Update alert settings with more realistic values
UPDATE public.alert_settings SET
    email_alerts = true,
    temperature_threshold = 30,
    humidity_threshold = 75,
    updated_at = now();
