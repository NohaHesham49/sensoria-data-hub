
#!/usr/bin/env python3
"""
Raspberry Pi DHT11 Sensor Data Logger
Compatible with the IoT Dashboard
Sends temperature and humidity data to Supabase in real-time
"""

import time
import json
import requests
import Adafruit_DHT
from datetime import datetime
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('sensor_log.txt'),
        logging.StreamHandler(sys.stdout)
    ]
)

class DHT11SensorLogger:
    def __init__(self):
        # Supabase configuration
        self.SUPABASE_URL = "https://ssanglgdpcedqgeigxjk.supabase.co"
        self.SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzYW5nbGdkcGNlZHFnZWlneGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwOTA0MjAsImV4cCI6MjA2MDY2NjQyMH0.v1pwbjltrKa5nVj8HJvINJlynlSKN2J63_puH6WTERw"
        
        # DHT11 sensor configuration
        self.DHT_SENSOR = Adafruit_DHT.DHT11
        self.DHT_PIN = 4  # GPIO pin 4 (you can change this)
        
        # Device configuration
        self.DEVICE_ID = "pi_sensor_001"  # Unique identifier for this Pi
        self.DEVICE_NAME = "Raspberry Pi DHT11"
        self.DEVICE_LOCATION = "Home Lab"
        
        # Data collection interval (seconds)
        self.INTERVAL = 10
        
        # Initialize device in database
        self.register_device()
    
    def register_device(self):
        """Register this device in the database if it doesn't exist"""
        try:
            headers = {
                'apikey': self.SUPABASE_KEY,
                'Authorization': f'Bearer {self.SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }
            
            device_data = {
                'id': self.DEVICE_ID,
                'name': self.DEVICE_NAME,
                'location': self.DEVICE_LOCATION,
                'type': 'Environmental',
                'status': 'online'
            }
            
            # Try to insert device (will fail silently if already exists)
            response = requests.post(
                f"{self.SUPABASE_URL}/rest/v1/devices",
                headers=headers,
                json=device_data
            )
            
            if response.status_code in [200, 201]:
                logging.info(f"Device {self.DEVICE_ID} registered successfully")
            else:
                logging.warning(f"Device registration response: {response.status_code}")
                
        except Exception as e:
            logging.error(f"Failed to register device: {e}")
    
    def read_sensor(self):
        """Read temperature and humidity from DHT11 sensor"""
        try:
            humidity, temperature = Adafruit_DHT.read_retry(self.DHT_SENSOR, self.DHT_PIN)
            
            if humidity is not None and temperature is not None:
                return {
                    'temperature': round(temperature, 1),
                    'humidity': round(humidity, 1),
                    'success': True
                }
            else:
                logging.warning("Failed to get sensor readings")
                return {'success': False}
                
        except Exception as e:
            logging.error(f"Sensor reading error: {e}")
            return {'success': False}
    
    def send_to_supabase(self, sensor_data):
        """Send sensor data to Supabase database"""
        try:
            headers = {
                'apikey': self.SUPABASE_KEY,
                'Authorization': f'Bearer {self.SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'device_id': self.DEVICE_ID,
                'temperature': sensor_data['temperature'],
                'humidity': sensor_data['humidity'],
                'pressure': None,  # DHT11 doesn't measure pressure
                'light': None,     # DHT11 doesn't measure light
                'motion': None,    # DHT11 doesn't detect motion
                'timestamp': datetime.utcnow().isoformat() + 'Z'
            }
            
            response = requests.post(
                f"{self.SUPABASE_URL}/rest/v1/sensor_data",
                headers=headers,
                json=payload
            )
            
            if response.status_code in [200, 201]:
                logging.info(f"Data sent successfully: T={sensor_data['temperature']}°C, H={sensor_data['humidity']}%")
                return True
            else:
                logging.error(f"Failed to send data. Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            logging.error(f"Network error: {e}")
            return False
    
    def update_device_status(self, status="online"):
        """Update device status in database"""
        try:
            headers = {
                'apikey': self.SUPABASE_KEY,
                'Authorization': f'Bearer {self.SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }
            
            update_data = {
                'status': status,
                'last_seen': datetime.utcnow().isoformat() + 'Z'
            }
            
            response = requests.patch(
                f"{self.SUPABASE_URL}/rest/v1/devices?id=eq.{self.DEVICE_ID}",
                headers=headers,
                json=update_data
            )
            
            if response.status_code == 204:
                logging.debug(f"Device status updated to {status}")
            
        except Exception as e:
            logging.error(f"Failed to update device status: {e}")
    
    def run(self):
        """Main loop to collect and send sensor data"""
        logging.info(f"Starting DHT11 sensor logger for device {self.DEVICE_ID}")
        logging.info(f"Data collection interval: {self.INTERVAL} seconds")
        logging.info(f"GPIO Pin: {self.DHT_PIN}")
        
        consecutive_failures = 0
        max_failures = 5
        
        try:
            while True:
                # Read sensor data
                data = self.read_sensor()
                
                if data['success']:
                    # Send to database
                    if self.send_to_supabase(data):
                        self.update_device_status("online")
                        consecutive_failures = 0
                    else:
                        consecutive_failures += 1
                else:
                    consecutive_failures += 1
                
                # Handle consecutive failures
                if consecutive_failures >= max_failures:
                    logging.error(f"Too many consecutive failures ({consecutive_failures}). Setting device to warning status.")
                    self.update_device_status("warning")
                    consecutive_failures = 0  # Reset counter
                
                # Wait before next reading
                time.sleep(self.INTERVAL)
                
        except KeyboardInterrupt:
            logging.info("Shutting down sensor logger...")
            self.update_device_status("offline")
            sys.exit(0)
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            self.update_device_status("offline")
            sys.exit(1)

if __name__ == "__main__":
    # Create and run the sensor logger
    logger = DHT11SensorLogger()
    logger.run()
