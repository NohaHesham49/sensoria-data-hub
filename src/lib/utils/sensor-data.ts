
import { subHours, format } from "date-fns";

// Types for our sensor data
export interface SensorData {
  id: string;
  temperature: number;
  humidity: number;
  pressure: number;
  light: number;
  motion: boolean;
  timestamp: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  lastSeen: string;
  type: string;
}

// Mock function to generate random sensor values
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Generate mock historical data for the past 24 hours with random fluctuations
export const generateMockHistoricalData = (
  hours = 24,
  deviceId = "sensor_001"
): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();

  // Base values
  let baseTemp = randomBetween(20, 25);
  let baseHumidity = randomBetween(40, 60);
  let basePressure = randomBetween(1000, 1020);
  let baseLight = randomBetween(200, 800);

  // Create data points for each hour with small fluctuations
  for (let i = hours; i >= 0; i--) {
    // Add small random changes to create realistic fluctuations
    baseTemp += randomBetween(-0.5, 0.5);
    baseHumidity += randomBetween(-2, 2);
    basePressure += randomBetween(-1, 1);
    
    // Light should follow a day/night cycle
    const hourOfDay = (24 - i) % 24;
    let lightMod = 1;
    
    if (hourOfDay >= 6 && hourOfDay <= 18) {
      // Daytime (higher light levels)
      lightMod = randomBetween(0.7, 1);
    } else {
      // Nighttime (lower light levels)
      lightMod = randomBetween(0.1, 0.3);
    }
    
    const timestamp = subHours(now, i);
    
    data.push({
      id: deviceId,
      temperature: parseFloat(baseTemp.toFixed(1)),
      humidity: parseFloat(baseHumidity.toFixed(1)),
      pressure: parseFloat(basePressure.toFixed(1)),
      light: parseFloat((baseLight * lightMod).toFixed(1)),
      motion: Math.random() > 0.8, // 20% chance of motion detection
      timestamp: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss"),
    });
  }

  return data;
};

// Function to get the latest sensor data
export const getLatestSensorData = (): SensorData => {
  return generateMockHistoricalData(0)[0];
};

// Generate a list of mock devices
export const getMockDevices = (): Device[] => {
  return [
    {
      id: "sensor_001",
      name: "Living Room Sensor",
      location: "Living Room",
      status: "online",
      lastSeen: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
      type: "Environmental"
    },
    {
      id: "sensor_002",
      name: "Kitchen Sensor",
      location: "Kitchen",
      status: "online",
      lastSeen: format(subHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss"),
      type: "Environmental"
    },
    {
      id: "sensor_003",
      name: "Bedroom Sensor",
      location: "Bedroom",
      status: "warning",
      lastSeen: format(subHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss"),
      type: "Environmental"
    },
    {
      id: "sensor_004",
      name: "Garage Sensor",
      location: "Garage",
      status: "offline",
      lastSeen: format(subHours(new Date(), 12), "yyyy-MM-dd'T'HH:mm:ss"),
      type: "Security"
    }
  ];
};

// Function to simulate a data stream with WebSocket-like behavior
export const createMockDataStream = (
  callback: (data: SensorData) => void,
  interval = 5000
) => {
  const timer = setInterval(() => {
    callback(getLatestSensorData());
  }, interval);
  
  return () => clearInterval(timer);
};
