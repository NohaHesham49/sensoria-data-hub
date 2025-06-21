
# Raspberry Pi DHT11 Sensor Setup

This Python script connects your Raspberry Pi with a DHT11 temperature and humidity sensor to your IoT dashboard, sending real-time data to Supabase.

## Hardware Requirements

- Raspberry Pi 4 (or any Pi with GPIO pins)
- DHT11 temperature and humidity sensor
- Jumper wires
- Breadboard (optional)

## Wiring Diagram

Connect the DHT11 sensor to your Raspberry Pi:

```
DHT11 Pin    →    Raspberry Pi Pin
VCC (+)      →    3.3V (Pin 1)
DATA         →    GPIO 4 (Pin 7)
GND (-)      →    Ground (Pin 6)
```

## Installation

1. **Transfer this folder to your Raspberry Pi**
   ```bash
   scp -r raspberry-pi/ pi@your-pi-ip:~/iot-sensor/
   ```

2. **SSH into your Raspberry Pi and navigate to the folder**
   ```bash
   ssh pi@your-pi-ip
   cd ~/iot-sensor/
   ```

3. **Run the installation script:**
   ```bash
   chmod +x install_dependencies.sh
   ./install_dependencies.sh
   ```

4. **Reboot your Raspberry Pi** (required for GPIO permissions):
   ```bash
   sudo reboot
   ```

## Configuration

You can modify these settings in `raspberry_pi_sensor.py`:

- `DHT_PIN`: GPIO pin number (default: 4)
- `DEVICE_ID`: Unique identifier for your sensor
- `DEVICE_NAME`: Display name in dashboard
- `DEVICE_LOCATION`: Location description
- `INTERVAL`: Data collection interval in seconds (default: 10)

## Running the Sensor Logger

### Manual Run:
```bash
python3 raspberry_pi_sensor.py
```

### Run as a Service (Auto-start on boot):

1. Create a systemd service file:
   ```bash
   sudo nano /etc/systemd/system/iot-sensor.service
   ```

2. Add this content (replace `/home/pi/iot-sensor/` with actual path):
   ```ini
   [Unit]
   Description=IoT Dashboard Sensor Logger
   After=network.target

   [Service]
   Type=simple
   User=pi
   WorkingDirectory=/home/pi/iot-sensor/
   ExecStart=/usr/bin/python3 /home/pi/iot-sensor/raspberry_pi_sensor.py
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:
   ```bash
   sudo systemctl enable iot-sensor.service
   sudo systemctl start iot-sensor.service
   ```

4. Check service status:
   ```bash
   sudo systemctl status iot-sensor.service
   ```

## Features

- **Real-time data collection** every 10 seconds (configurable)
- **Automatic device registration** in your dashboard
- **Error handling** with retry logic
- **Status updates** (online/offline/warning)
- **Logging** to both file and console
- **Graceful shutdown** on Ctrl+C

## Troubleshooting

### Permission Errors:
```bash
sudo usermod -a -G gpio $USER
# Then reboot
```

### Sensor Reading Errors:
- Check wiring connections
- Verify GPIO pin number in code
- Try a different GPIO pin

### Network Errors:
- Check internet connection
- Verify Supabase URL and API key

### View Logs:
```bash
tail -f sensor_log.txt
```

## Dashboard Integration

Once running, your sensor data will appear in the dashboard:
- Device will show as "online" in the device list
- Temperature and humidity readings will update in real-time
- Historical data will be plotted in charts
- Alerts will trigger based on your configured thresholds

The device will automatically appear as "Raspberry Pi DHT11" in your dashboard's device list.

## Transfer Instructions

To transfer this folder to your Raspberry Pi:

1. **Using SCP (from your computer):**
   ```bash
   scp -r raspberry-pi/ pi@192.168.1.100:~/iot-sensor/
   ```

2. **Using USB drive:**
   - Copy the `raspberry-pi` folder to a USB drive
   - Insert USB drive into Pi
   - Copy folder to Pi's home directory

3. **Using GitHub:**
   - Push this folder to a GitHub repository
   - Clone on the Pi: `git clone your-repo-url`
